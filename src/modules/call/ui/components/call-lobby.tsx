import {
  DefaultVideoPlaceholder,
  StreamVideoParticipant,
  ToggleAudioPreviewButton,
  ToggleVideoPreviewButton,
  useCallStateHooks,
  VideoPreview
} from '@stream-io/video-react-sdk';
import '@stream-io/video-react-sdk/dist/css/styles.css';
import { LogInIcon } from 'lucide-react';
import Link from 'next/link';
import { authClient } from '@/lib/auth-client';
import { generateAvatar } from '@/lib/avatar';
import { Button } from '@/components/ui/button';

type CallLobbyProps = {
  onJoinCall: () => void;
};

const DisabledVideoPreview = () => {
  const { data: session } = authClient.useSession();

  return (
    <div className='flex flex-col items-center justify-center'>
      <DefaultVideoPlaceholder
        participant={
          {
            name: session?.user?.name ?? 'Unknown',
            image:
              session?.user?.image ??
              generateAvatar({
                seed: session?.user?.name ?? '',
                variant: 'initials'
              })
          } as StreamVideoParticipant
        }
      />
    </div>
  );
};

const AllowBrowserPermissions = () => {
  return (
    <p className='text-sm'>
      Please ensure you have the necessary permissions to access your camera and
      microphone.
    </p>
  );
};

export default function CallLobby({ onJoinCall }: CallLobbyProps) {
  const { useCameraState, useMicrophoneState } = useCallStateHooks();

  const { hasBrowserPermission: hasCameraPermission } = useCameraState();
  const { hasBrowserPermission: hasMicrophonePermission } =
    useMicrophoneState();

  const hasBrowserMediaPermissions =
    !!hasCameraPermission && !!hasMicrophonePermission;

  const handleJoinCall = async () => {
    if (!hasBrowserMediaPermissions) return;
    onJoinCall();
  };

  return (
    <div className='from-sidebar-accent to-sidebar flex h-full flex-col items-center justify-center bg-radial'>
      <div className='flex flex-1 items-center justify-center px-8 py-4'>
        <div className='bg-background flex flex-col items-center justify-center gap-y-6 rounded-lg p-10 shadow-sm'>
          <div className='flex flex-col items-center gap-y-2'>
            <h1 className='text-lg font-medium'>Ready to join the call?</h1>
            <p className='text-muted-foreground text-sm'>
              Please ensure you have the necessary permissions to access your
              camera and microphone.
            </p>
          </div>
          <VideoPreview
            className='w-full!'
            DisabledVideoPreview={
              hasBrowserMediaPermissions
                ? DisabledVideoPreview
                : AllowBrowserPermissions
            }
          />
          <div className='flex gap-x-2'>
            <ToggleAudioPreviewButton />
            <ToggleVideoPreviewButton />
          </div>

          <div className='flex w-full items-center justify-between gap-x-2'>
            <Button variant='outline'>
              <Link href='/meetings'>Cancel</Link>
            </Button>
            <Button onClick={handleJoinCall}>
              <LogInIcon />
              Join Call
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
