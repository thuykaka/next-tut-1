'use client';

import { useSuspenseQuery } from '@tanstack/react-query';
import { VideoIcon } from 'lucide-react';
import { useTRPC } from '@/trpc/client';
import { AgentDetailViewHeader } from '@/modules/agents/ui/components/agent-detail-view-header';
import { Badge } from '@/components/ui/badge';
import { ErrorState } from '@/components/error-state';
import { GeneratedAvatar } from '@/components/generated-avatar';
import { LoadingState } from '@/components/loading-state';

type AgentDetailViewProps = {
  agentId: string;
};

export function AgentDetailView({ agentId }: AgentDetailViewProps) {
  const trpc = useTRPC();

  const { data } = useSuspenseQuery(
    trpc.agents.getOne.queryOptions({ id: agentId })
  );

  return (
    <div className='flex flex-col gap-4'>
      <AgentDetailViewHeader
        agentId={agentId}
        agentName={data.name}
        onEdit={() => {}}
        onDelete={() => {}}
      />
      <div className='bg-background overflow-hidden rounded-lg border'>
        <div className='col-span-5 flex flex-col gap-y-5 px-4 py-5'>
          <div className='flex items-center gap-x-3'>
            <GeneratedAvatar
              seed={data.name}
              variant='botttsNeutral'
              className='size-10'
            />
            <h2 className='text-2xl font-medium'>{data.name}</h2>
          </div>
          <Badge
            variant='outline'
            className='flex items-center gap-x-2 [&>svg]:size-4'
          >
            <VideoIcon className='text-blue-700' />
            {data.meetingCount}{' '}
            {data.meetingCount === 1 ? 'meeting' : 'meetings'}
          </Badge>

          <div className='flex flex-col gap-y-2'>
            <p className='text-lg font-medium'>Instructions</p>
            <p className='text-neutral-800'>{data.instructions}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export function AgentDetailViewLoading() {
  return <LoadingState title='Loading Detail Agent' />;
}

export function AgentDetailViewError() {
  return <ErrorState title='Failed to load detail agent' />;
}
