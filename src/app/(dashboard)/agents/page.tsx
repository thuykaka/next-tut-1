import { Suspense } from 'react';
import { dehydrate, HydrationBoundary } from '@tanstack/react-query';
import { headers } from 'next/headers';
import { redirect } from 'next/navigation';
import { ErrorBoundary } from 'react-error-boundary';
import { getQueryClient, trpc } from '@/trpc/server';
import { auth } from '@/lib/auth';
import { loadAgentsSearchParams } from '@/modules/agents/params';
import AgentsListHeader from '@/modules/agents/ui/components/agent-list-header';
import {
  AgentsView,
  AgentsViewError,
  AgentsViewLoading
} from '@/modules/agents/ui/views/agents-view';

type Props = {
  searchParams: Promise<{
    page: string;
    search: string;
  }>;
};

export default async function AgentsPage({ searchParams }: Props) {
  const params = await loadAgentsSearchParams(searchParams);

  const session = await auth.api.getSession({
    headers: await headers()
  });

  if (!session) {
    return redirect('/sign-in');
  }

  const queryClient = getQueryClient();
  void queryClient.prefetchQuery(trpc.agents.getMany.queryOptions(params));

  return (
    <>
      <AgentsListHeader />
      <HydrationBoundary state={dehydrate(queryClient)}>
        <Suspense fallback={<AgentsViewLoading />}>
          <ErrorBoundary fallback={<AgentsViewError />}>
            <AgentsView />
          </ErrorBoundary>
        </Suspense>
      </HydrationBoundary>
    </>
  );
}
