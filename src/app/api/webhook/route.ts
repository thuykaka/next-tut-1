import {
  CallSessionStartedEvent,
  CallSessionParticipantLeftEvent
} from '@stream-io/node-sdk';
import { eq, getTableColumns, ilike, and, desc, not } from 'drizzle-orm';
import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { agents, meetings } from '@/db/schema';
import { streamVideoServerClient } from '@/lib/stream-video-server';
import { MeetingStatus } from '@/modules/meetings/types';

const verifySignatureWithSDK = (body: any, signature: string): boolean => {
  return streamVideoServerClient.verifyWebhook(body, signature);
};

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
  }

  return NextResponse.json({ status: 'ok' }, { status: 200 });
}
