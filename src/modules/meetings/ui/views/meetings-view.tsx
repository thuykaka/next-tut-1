'use client';

import { useSuspenseQuery } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { useTRPC } from '@/trpc/client';
import { ErrorState } from '@/components/error-state';
import { LoadingState } from '@/components/loading-state';

export function MeetingsView() {
  const router = useRouter();

  const trpc = useTRPC();
  const { data } = useSuspenseQuery(trpc.meetings.getMany.queryOptions());

  return <div>{JSON.stringify(data, null, 2)}</div>;
}

export function MeetingsViewLoading() {
  return <LoadingState title='Loading Meetings' />;
}

export function MeetingsViewError() {
  return <ErrorState title='Failed to load meetings' />;
}
