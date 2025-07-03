import { useEffect, useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import {
  Call,
  CallingState,
  StreamCall,
  StreamVideo,
  StreamVideoClient
} from '@stream-io/video-react-sdk';
import '@stream-io/video-react-sdk/dist/css/styles.css';
import { useTRPC } from '@/trpc/client';
import CallUI from '@/modules/call/ui/components/call-ui';
import { Spinner } from '@/components/ui/kibo-ui/spinner';

type CallConnectProps = {
  meetingId: string;
  meetingName: string;
  userName: string;
  userId: string;
  userImage: string;
};

export default function CallConnect({
  meetingId,
  meetingName,
  userName,
  userId,
  userImage
}: CallConnectProps) {
  const [client, setClient] = useState<StreamVideoClient>();
  const [call, setCall] = useState<Call>();
  const trpc = useTRPC();

  const { mutateAsync: generateToken } = useMutation(
    trpc.meetings.generateToken.mutationOptions()
  );

  useEffect(() => {
    // Tạo client Stream Video
    const _client = new StreamVideoClient({
      apiKey: process.env.NEXT_PUBLIC_STREAM_VIDEO_API_KEY!,
      user: {
        id: userId,
        name: userName,
        image: userImage
      },
      tokenProvider: generateToken
    });

    setClient(_client);

    return () => {
      _client.disconnectUser();
    };
  }, []);

  useEffect(() => {
    if (!client) return;

    const _call = client.call('default', meetingId);
    _call.camera.disable();
    _call.microphone.disable();

    setCall(_call);

    return () => {
      if (_call.state.callingState !== CallingState.LEFT) {
        console.log('1. leave call');
        _call.leave();
        _call.endCall();
        setCall(undefined);
      }
    };
  }, [client, meetingId]);

  if (!client || !call) {
    return (
      <div className='from-sidebar-accent to-sidebar flex h-screen items-center justify-center bg-radial'>
        <Spinner className='size-20 text-white' variant='ring' />
      </div>
    );
  }

  return (
    <StreamVideo client={client}>
      <StreamCall call={call}>
        <CallUI meetingName={meetingName} />
      </StreamCall>
    </StreamVideo>
  );
}
