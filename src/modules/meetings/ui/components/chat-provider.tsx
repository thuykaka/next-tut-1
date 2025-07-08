import { authClient } from '@/lib/auth-client';
import { ChatUI } from '@/modules/meetings/ui/components/chat-ui';
import { Skeleton } from '@/components/ui/skeleton';

type ChatProviderProps = {
  meetingId: string;
  meetingName: string;
};

export const ChatProvider = ({ meetingId, meetingName }: ChatProviderProps) => {
  const { data: session, isPending } = authClient.useSession();

  if (isPending || !session?.user) {
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
    <ChatUI
      meetingId={meetingId}
      meetingName={meetingName}
      userId={session.user.id}
      userName={session.user.name}
      userImage={session.user.image}
    />
  );
};
