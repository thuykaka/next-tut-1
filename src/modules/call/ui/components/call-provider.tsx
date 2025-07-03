import { authClient } from '@/lib/auth-client';
import { generateAvatar } from '@/lib/avatar';
import CallConnect from '@/modules/call/ui/components/call-connect';
import { Spinner } from '@/components/ui/kibo-ui/spinner';

type CallProviderProps = {
  meetingId: string;
  meetingName: string;
};

export default function CallProvider({
  meetingId,
  meetingName
}: CallProviderProps) {
  const { data: session, isPending } = authClient.useSession();

  if (!session || isPending) {
    return (
      <div className='from-sidebar-accent to-sidebar flex h-screen items-center justify-center bg-radial'>
        <Spinner className='size-20 text-white' variant='ring' />
      </div>
    );
  }

  return (
    <CallConnect
      meetingId={meetingId}
      meetingName={meetingName}
      userName={session.user.name}
      userId={session.user.id}
      userImage={
        session.user.image ??
        generateAvatar({ seed: session.user.name, variant: 'initials' })
      }
    />
  );
}
