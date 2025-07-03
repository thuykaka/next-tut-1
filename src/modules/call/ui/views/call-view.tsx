'use client';

import { useSuspenseQuery } from '@tanstack/react-query';
import { useTRPC } from '@/trpc/client';
import CallProvider from '@/modules/call/ui/components/call-provider';
import { MeetingStatus } from '@/modules/meetings/types';
import { ErrorState } from '@/components/error-state';
import { LoadingState } from '@/components/loading-state';

type CallViewProps = {
  meetingId: string;
};

export function CallView({ meetingId }: CallViewProps) {
  const trpc = useTRPC();
  const { data } = useSuspenseQuery(
    trpc.meetings.getOne.queryOptions({ id: meetingId })
  );

  if (data.status === MeetingStatus.COMPLETED) {
    return (
      <div className='flex h-screen items-center justify-center'>
        <ErrorState
          title='Meeting has ended'
          description='You can no longer join this meeting.'
        />
      </div>
    );
  }

  return <CallProvider meetingId={meetingId} meetingName={data.name} />;
}

export function CallViewLoading() {
  return <LoadingState title='Loading Call' />;
}

export function CallViewError() {
  return <ErrorState title='Failed to load call' />;
}
