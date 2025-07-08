import { useMemo, useState, useCallback } from 'react';
import { useCall, StreamTheme } from '@stream-io/video-react-sdk';
import CallActive from '@/modules/call/ui/components/call-active';
import CallEnded from '@/modules/call/ui/components/call-ended';
import CallLobby from '@/modules/call/ui/components/call-lobby';

type CallUIProps = {
  meetingName: string;
};

type CallViewState = 'lobby' | 'call' | 'ended';

const CallView = ({
  state,
  meetingName,
  onJoinCall,
  onLeaveCall
}: {
  state: CallViewState;
  meetingName: string;
  onJoinCall: () => void;
  onLeaveCall: () => void;
}) => {
  switch (state) {
    case 'lobby':
      return <CallLobby onJoinCall={onJoinCall} />;
    case 'call':
      return <CallActive meetingName={meetingName} onLeaveCall={onLeaveCall} />;
    case 'ended':
      return <CallEnded />;
    default:
      return null;
  }
};

export default function CallUI({ meetingName }: CallUIProps) {
  const call = useCall();
  const [currentView, setCurrentView] = useState<CallViewState>('lobby');

  const handleJoinCall = useCallback(async () => {
    if (!call) return;

    try {
      await call.join();
      setCurrentView('call');
    } catch (error) {
      console.error('Failed to join call:', error);
    }
  }, [call]);

  const handleLeaveCall = useCallback(() => {
    if (!call) return;
    console.log('leave call');
    setCurrentView('ended');
  }, [call]);

  const callViewComponent = useMemo(
    () => (
      <CallView
        state={currentView}
        meetingName={meetingName}
        onJoinCall={handleJoinCall}
        onLeaveCall={handleLeaveCall}
      />
    ),
    [currentView, meetingName, handleJoinCall, handleLeaveCall]
  );

  return <StreamTheme className='h-full'>{callViewComponent}</StreamTheme>;
}
