'use client';

import { useSuspenseQuery } from '@tanstack/react-query';
import { useTRPC } from '@/trpc/client';
import { ErrorState } from '@/components/error-state';
import { LoadingState } from '@/components/loading-state';

export function AgentsView() {
  const trpc = useTRPC();
  const { data } = useSuspenseQuery(trpc.agents.getMany.queryOptions());

  return <div>{JSON.stringify(data, null, 2)}</div>;
}

export function AgentsViewLoading() {
  return (
    <LoadingState
      title='Loading Agents'
      description='This may take a few seconds...'
    />
  );
}

export function AgentsViewError() {
  return (
    <ErrorState
      title='Failed to load agents'
      description='Something went wrong. Please try again later.'
    />
  );
}
