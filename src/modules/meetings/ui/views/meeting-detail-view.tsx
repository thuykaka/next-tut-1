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
import UpdateMeetingDialog from '@/modules/meetings/ui/components/update-meeting-dialog';
import { Badge } from '@/components/ui/badge';
import { DetailViewHeader } from '@/components/detail-view-header';
import { ErrorState } from '@/components/error-state';
import { GeneratedAvatar } from '@/components/generated-avatar';
import { LoadingState } from '@/components/loading-state';

type MeetingDetailViewProps = {
  meetingId: string;
};

export function MeetingDetailView({ meetingId }: MeetingDetailViewProps) {
  const [isUpdateMeetingDialogOpen, setIsUpdateMeetingDialogOpen] =
    useState(false);

  const router = useRouter();

  const trpc = useTRPC();

  const { data } = useSuspenseQuery(
    trpc.meetings.getOne.queryOptions({ id: meetingId })
  );

  const queryClient = useQueryClient();

  const { mutate: removeMeeting } = useMutation(
    trpc.meetings.remove.mutationOptions({
      onSuccess: async () => {
        await queryClient.invalidateQueries(
          trpc.meetings.getMany.queryOptions()
        );
        router.push('/meetings');
      },
      onError: (error) => {
        toast.error(error.message, {
          description: 'Failed to remove meeting, please try again.'
        });
      }
    })
  );

  const {
    ConfirmDialog: ConfirmRemoveMeetingDialog,
    confirm: confirmRemoveMeeting
  } = useConfirm({
    title: 'Are you sure you want to delete this meeting?',
    description: `The following action will delete the meeting and all associated data.`
  });

  const handleRemoveMeeting = async () => {
    const confirmed = await confirmRemoveMeeting();
    if (!confirmed) return;
    removeMeeting({ id: meetingId });
  };

  return (
    <div className='flex flex-col gap-4'>
      <DetailViewHeader
        root={{ title: 'Meetings', link: '/meetings' }}
        paths={[{ title: data.name, link: `/meetings/${meetingId}` }]}
        onEdit={() => setIsUpdateMeetingDialogOpen(true)}
        onDelete={handleRemoveMeeting}
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
          </Badge>

          <div className='flex flex-col gap-y-2'>
            <p className='text-lg font-medium'>Instructions</p>
            <p className='text-neutral-800'></p>
          </div>
        </div>
      </div>

      <ConfirmRemoveMeetingDialog />

      <UpdateMeetingDialog
        open={isUpdateMeetingDialogOpen}
        onOpenChange={setIsUpdateMeetingDialogOpen}
        initialValues={data}
      />
    </div>
  );
}

export function MeetingDetailViewLoading() {
  return <LoadingState title='Loading Detail Meeting' />;
}

export function MeetingDetailViewError() {
  return <ErrorState title='Failed to load detail meeting' />;
}
