import {
  CallSessionStartedEvent,
  CallSessionParticipantLeftEvent,
  CallSessionEndedEvent,
  CallTranscriptionReadyEvent,
  CallRecordingReadyEvent,
  MessageNewEvent
} from '@stream-io/node-sdk';
import { eq, and } from 'drizzle-orm';
import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';
import { ChatCompletionMessageParam } from 'openai/resources/chat/completions';
import { db } from '@/db';
import { agents, meetings } from '@/db/schema';
import { generateAvatar } from '@/lib/avatar';
import { inngest } from '@/lib/inngest/client';
import { streamChatServerClient } from '@/lib/stream-chat-server';
import { streamVideoServerClient } from '@/lib/stream-video-server';
import { MeetingStatus } from '@/modules/meetings/types';

const verifySignatureWithSDK = (body: any, signature: string): boolean => {
  return streamVideoServerClient.verifyWebhook(body, signature);
};

const openAiClient = new OpenAI({
  apiKey: process.env.OPEN_API_KEY!
});

export async function POST(request: NextRequest) {
  const signature = request.headers.get('x-signature');
  const apiKey = request.headers.get('x-api-key');

  if (!signature || !apiKey) {
    return NextResponse.json(
      { error: 'Missing signature or api key' },
      { status: 400 }
    );
  }

  const body = await request.text();

  if (!verifySignatureWithSDK(body, signature)) {
    return NextResponse.json({ error: 'Invalid signature' }, { status: 401 });
  }

  let payload: Record<string, unknown>;
  try {
    payload = JSON.parse(body) as Record<string, unknown>;
  } catch (error) {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 });
  }

  const eventType = payload?.type;

  // Event trigger khi cuộc gọi từ streamio được bắt đầu
  if (eventType === 'call.session_started') {
    const event = payload as unknown as CallSessionStartedEvent;
    const meetingId = event.call.custom?.meetingId;

    if (!meetingId) {
      console.warn('Missing meetingId');
      return NextResponse.json({ error: 'Missing meetingId' }, { status: 400 });
    }

    const [updatedMeeting] = await db
      .update(meetings)
      .set({
        status: MeetingStatus.ACTIVE,
        startedAt: new Date()
      })
      .where(
        and(
          eq(meetings.id, meetingId),
          eq(meetings.status, MeetingStatus.UPCOMING)
        )
      )
      .returning();

    if (!updatedMeeting) {
      console.warn('Meeting not found or already processed');
      return NextResponse.json(
        { error: 'Meeting not found or already processed' },
        { status: 404 }
      );
    }

    const [existingAgent] = await db
      .select()
      .from(agents)
      .where(eq(agents.id, updatedMeeting.agentId));

    if (!existingAgent) {
      console.warn('Agent not found');
      return NextResponse.json({ error: 'Agent not found' }, { status: 404 });
    }

    // Start call
    const call = streamVideoServerClient.video.call('default', meetingId);

    const realtimeClient = await streamVideoServerClient.video.connectOpenAi({
      call,
      agentUserId: existingAgent.id,
      openAiApiKey: process.env.OPEN_API_KEY!
    });

    realtimeClient.updateSession({
      instructions: existingAgent.instructions
    });
  } else if (eventType === 'call.session_participant_left') {
    const event = payload as unknown as CallSessionParticipantLeftEvent;
    const meetingId = event.call_cid.split(':')[1]; // call_cid: type:id

    if (!meetingId) {
      return NextResponse.json({ error: 'Missing meetingId' }, { status: 400 });
    }

    const call = streamVideoServerClient.video.call('default', meetingId);

    await call.end();
  } else if (eventType === 'call.session_ended') {
    const event = payload as unknown as CallSessionEndedEvent;

    const meetingId = event.call.custom?.meetingId;
    if (!meetingId) {
      return NextResponse.json({ error: 'Missing meetingId' }, { status: 400 });
    }

    await db
      .update(meetings)
      .set({
        status: MeetingStatus.PROCESSING,
        endedAt: new Date()
      })
      .where(
        and(
          eq(meetings.id, meetingId),
          eq(meetings.status, MeetingStatus.ACTIVE)
        )
      );
  } else if (eventType === 'call.transcription_ready') {
    const event = payload as unknown as CallTranscriptionReadyEvent;

    const meetingId = event.call_cid.split(':')[1];
    if (!meetingId) {
      return NextResponse.json({ error: 'Missing meetingId' }, { status: 400 });
    }

    const [updatedMeeting] = await db
      .update(meetings)
      .set({
        transcriptUrl: event.call_transcription.url
      })
      .where(eq(meetings.id, meetingId))
      .returning();

    if (!updatedMeeting) {
      return NextResponse.json({ error: 'Meeting not found' }, { status: 404 });
    }

    // Send to background job to summarize the transcript
    inngest.send({
      name: 'meetings/processing',
      data: {
        meetingId,
        transcriptUrl: event.call_transcription.url
      }
    });
  } else if (eventType === 'call.recording_ready') {
    const event = payload as unknown as CallRecordingReadyEvent;

    const meetingId = event.call_cid.split(':')[1];
    if (!meetingId) {
      return NextResponse.json({ error: 'Missing meetingId' }, { status: 400 });
    }

    await db
      .update(meetings)
      .set({
        recordingUrl: event.call_recording.url
      })
      .where(eq(meetings.id, meetingId));
  } else if (eventType === 'message.new') {
    const event = payload as unknown as MessageNewEvent;
    const userId = event.user?.id;
    const channelId = event.channel_id;
    const text = event.message?.text;

    if (!userId || !channelId || !text) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const [existingMeeting] = await db
      .select()
      .from(meetings)
      .where(
        and(
          eq(meetings.id, channelId),
          eq(meetings.status, MeetingStatus.COMPLETED)
        )
      );

    if (!existingMeeting) {
      return NextResponse.json({ error: 'Meeting not found' }, { status: 404 });
    }

    const [existingAgent] = await db
      .select()
      .from(agents)
      .where(eq(agents.id, existingMeeting.agentId));

    if (!existingAgent) {
      return NextResponse.json({ error: 'Agent not found' }, { status: 404 });
    }

    if (userId !== existingAgent.id) {
      const instructions = `
      You are an AI assistant helping the user revisit a recently completed meeting.
      Below is a summary of the meeting, generated from the transcript:
      
      ${existingMeeting.summary}
      
      The following are your original instructions from the live meeting assistant. Please continue to follow these behavioral guidelines as you assist the user:
      
      ${existingAgent.instructions}
      
      The user may ask questions about the meeting, request clarifications, or ask for follow-up actions.
      Always base your responses on the meeting summary above.
      
      You also have access to the recent conversation history between you and the user. Use the context of previous messages to provide relevant, coherent, and helpful responses. If the user's question refers to something discussed earlier, make sure to take that into account and maintain continuity in the conversation.
      
      If the summary does not contain enough information to answer a question, politely let the user know.
      
      Be concise, helpful, and focus on providing accurate information from the meeting and the ongoing conversation.
      `;

      const channel = streamChatServerClient.channel('messaging', channelId);
      await channel.watch();

      const previousMessages = channel.state.messages
        .slice(-5)
        .filter((msg) => msg.text && msg.text.trim() !== '')
        .map<ChatCompletionMessageParam>((msg) => ({
          role: msg.user?.id === userId ? 'user' : 'assistant',
          content: msg.text || ''
        }));

      const gptResponse = await openAiClient.chat.completions.create({
        model: 'gpt-4o-mini',
        messages: [
          { role: 'system', content: instructions },
          ...previousMessages,
          { role: 'user', content: text }
        ]
      });

      const gptResponseText = gptResponse.choices[0].message.content;

      const avatarUrl = generateAvatar({
        seed: existingAgent.name,
        variant: 'botttsNeutral'
      });

      streamChatServerClient.upsertUser({
        id: existingAgent.id,
        name: existingAgent.name,
        image: avatarUrl
      });

      await channel.sendMessage({
        text: gptResponseText || '',
        user: {
          id: existingAgent.id,
          name: existingAgent.name,
          image: avatarUrl
        }
      });
    }
  }

  return NextResponse.json({ status: 'ok' }, { status: 200 });
}
