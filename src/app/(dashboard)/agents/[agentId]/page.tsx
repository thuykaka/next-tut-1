import { Suspense } from 'react';
import { HydrationBoundary, dehydrate } from '@tanstack/react-query';
import { headers } from 'next/headers';
import { redirect } from 'next/navigation';
import { ErrorBoundary } from 'react-error-boundary';
import { getQueryClient, trpc } from '@/trpc/server';
import { auth } from '@/lib/auth';
import {
  AgentDetailView,
  AgentDetailViewError,
  AgentDetailViewLoading
} from '@/modules/agents/ui/views/agent-detail-view';

type AgentDetailPageProps = {
  params: Promise<{ agentId: string }>;
};

export default async function AgentDetailPage({
  params
}: AgentDetailPageProps) {
  const session = await auth.api.getSession({
    headers: await headers()
  });

  if (!session) {
    return redirect('/sign-in');
  }

  const { agentId } = await params;

  const queryClient = getQueryClient();
  void queryClient.prefetchQuery(
    trpc.agents.getOne.queryOptions({ id: agentId })
  );

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <Suspense fallback={<AgentDetailViewLoading />}>
        <ErrorBoundary fallback={<AgentDetailViewError />}>
          <AgentDetailView agentId={agentId} />
        </ErrorBoundary>
      </Suspense>
    </HydrationBoundary>
  );
}
