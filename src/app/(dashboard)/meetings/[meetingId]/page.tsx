import { Suspense } from 'react';
import { HydrationBoundary, dehydrate } from '@tanstack/react-query';
import { headers } from 'next/headers';
import { redirect } from 'next/navigation';
import { ErrorBoundary } from 'react-error-boundary';
import { getQueryClient, trpc } from '@/trpc/server';
import { auth } from '@/lib/auth';
import {
  MeetingDetailViewLoading,
  MeetingDetailViewError,
  MeetingDetailView
} from '@/modules/meetings/ui/views/meeting-detail-view';

type MeetingDetailPageProps = {
  params: Promise<{ meetingId: string }>;
};

export default async function MeetingDetailPage({
  params
}: MeetingDetailPageProps) {
  const session = await auth.api.getSession({
    headers: await headers()
  });

  if (!session) {
    return redirect('/sign-in');
  }

  const { meetingId } = await params;

  const queryClient = getQueryClient();

  void queryClient.prefetchQuery(
    trpc.meetings.getOne.queryOptions({ id: meetingId })
  );

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <Suspense fallback={<MeetingDetailViewLoading />}>
        <ErrorBoundary fallback={<MeetingDetailViewError />}>
          <MeetingDetailView meetingId={meetingId} />
        </ErrorBoundary>
      </Suspense>
    </HydrationBoundary>
  );
}
