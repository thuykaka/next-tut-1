'use client';

import { useState } from 'react';
import {
  useSuspenseQuery,
  useQueryClient,
  useMutation
} from '@tanstack/react-query';
import { VideoIcon } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { useTRPC } from '@/trpc/client';
import { useConfirm } from '@/hooks/use-confirm';
import { AgentDetailViewHeader } from '@/modules/agents/ui/components/agent-detail-view-header';
import UpdateAgentDialog from '@/modules/agents/ui/components/update-agent-dialog';
import { Badge } from '@/components/ui/badge';
import { ErrorState } from '@/components/error-state';
import { GeneratedAvatar } from '@/components/generated-avatar';
import { LoadingState } from '@/components/loading-state';

type AgentDetailViewProps = {
  agentId: string;
};

export function AgentDetailView({ agentId }: AgentDetailViewProps) {
  const [isUpdateAgentDialogOpen, setIsUpdateAgentDialogOpen] = useState(false);

  const router = useRouter();

  const trpc = useTRPC();

  const { data } = useSuspenseQuery(
    trpc.agents.getOne.queryOptions({ id: agentId })
  );

  const queryClient = useQueryClient();

  const { mutate: removeAgent } = useMutation(
    trpc.agents.remove.mutationOptions({
      onSuccess: async () => {
        await queryClient.invalidateQueries(trpc.agents.getMany.queryOptions());
        router.push('/agents');
      },
      onError: (error) => {
        toast.error(error.message, {
          description: 'Failed to remove agent, please try again.'
        });
      }
    })
  );

  const {
    ConfirmDialog: ConfirmRemoveAgentDialog,
    confirm: confirmRemoveAgent
  } = useConfirm({
    title: 'Are you sure you want to delete this agent?',
    description: `The following action will delete ${data.meetingCount} associated meetings.`
  });

  const handleRemoveAgent = async () => {
    const confirmed = await confirmRemoveAgent();
    if (!confirmed) return;
    removeAgent({ id: agentId });
  };

  return (
    <div className='flex flex-col gap-4'>
      <AgentDetailViewHeader
        agentName={data.name}
        onEdit={() => setIsUpdateAgentDialogOpen(true)}
        onDelete={handleRemoveAgent}
      />

      <div className='bg-background overflow-hidden rounded-lg border'>
        <div className='col-span-5 flex flex-col gap-y-5 px-4 py-5'>
          <div className='flex items-center gap-x-3'>
            <GeneratedAvatar
              seed={data.name}
              variant='botttsNeutral'
              className='size-10 rounded-full'
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

      <ConfirmRemoveAgentDialog />

      <UpdateAgentDialog
        open={isUpdateAgentDialogOpen}
        onOpenChange={setIsUpdateAgentDialogOpen}
        initialValues={data}
      />
    </div>
  );
}

export function AgentDetailViewLoading() {
  return <LoadingState title='Loading Detail Agent' />;
}

export function AgentDetailViewError() {
  return <ErrorState title='Failed to load detail agent' />;
}
