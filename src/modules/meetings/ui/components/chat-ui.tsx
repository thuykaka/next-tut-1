import { useEffect, useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import type { Channel as StreamChannel } from 'stream-chat';
import {
  useCreateChatClient,
  Chat,
  Channel,
  ChannelHeader,
  MessageInput,
  MessageList,
  Thread,
  Window
} from 'stream-chat-react';
import 'stream-chat-react/dist/css/v2/index.css';
import 'stream-chat-react/dist/css/v2/index.css';
import { StickToBottom, useStickToBottomContext } from 'use-stick-to-bottom';
import { useTRPC } from '@/trpc/client';
import { Skeleton } from '@/components/ui/skeleton';

type ChatUIProps = {
  meetingId: string;
  meetingName: string;
  userId: string;
  userName: string;
  userImage?: string | null;
};

const ScrollToBottom = () => {
  const { isAtBottom, scrollToBottom } = useStickToBottomContext();

  return (
    !isAtBottom && (
      <button
        className='i-ph-arrow-circle-down-fill absolute bottom-0 left-[50%] translate-x-[-50%] rounded-lg text-4xl'
        onClick={() => scrollToBottom()}
      />
    )
  );
};

export const ChatUI = ({
  meetingId,
  meetingName,
  userId,
  userName,
  userImage
}: ChatUIProps) => {
  const trpc = useTRPC();

  const { mutateAsync: generateToken } = useMutation(
    trpc.meetings.generateChatToken.mutationOptions()
  );

  const [chatChannel, setChatChannel] = useState<StreamChannel>();

  const client = useCreateChatClient({
    apiKey: process.env.NEXT_PUBLIC_STREAM_CHAT_API_KEY!,
    tokenOrProvider: generateToken,
    userData: {
      id: userId,
      name: userName,
      image: userImage ?? ''
    }
  });

  useEffect(() => {
    if (!client) return;

    const channel = client.channel('messaging', meetingId, {
      members: [userId]
    });

    setChatChannel(channel);
  }, [client, meetingId, meetingName, userId]);

  if (!client) {
    return (
      <div className='flex w-full flex-col gap-y-4 bg-white p-3'>
        <div className='flex flex-col gap-y-4'>
          <Skeleton className='h-3 w-full' />
          <Skeleton className='h-3 w-full' />
          <Skeleton className='h-3 w-full' />
        </div>
      </div>
    );
  }

  return (
    <div className='overflow-hidden'>
      <Chat client={client}>
        <Channel channel={chatChannel}>
          <Window>
            <StickToBottom
              className='relative h-[50vh]'
              resize='smooth'
              initial='smooth'
            >
              <StickToBottom.Content className='flex flex-col gap-4'>
                <MessageList />
              </StickToBottom.Content>

              <ScrollToBottom />
            </StickToBottom>
            <MessageInput />
          </Window>
          <Thread />
        </Channel>
      </Chat>
    </div>
  );
};
