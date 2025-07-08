'use client';

import { useState, useMemo, useCallback } from 'react';
import {
  useSuspenseQuery,
  useQueryClient,
  useMutation
} from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { useTRPC } from '@/trpc/client';
import { useConfirm } from '@/hooks/use-confirm';
import { MeetingGetOne, MeetingStatus } from '@/modules/meetings/types';
import ActiveState from '@/modules/meetings/ui/components/active-state';
import CancelledState from '@/modules/meetings/ui/components/cancelled-state';
import CompletedState from '@/modules/meetings/ui/components/completed-state';
import ProcessingState from '@/modules/meetings/ui/components/processing-state';
import UpcomingState from '@/modules/meetings/ui/components/upcoming-state';
import UpdateMeetingDialog from '@/modules/meetings/ui/components/update-meeting-dialog';
import { DetailViewHeader } from '@/components/detail-view-header';
import { ErrorState } from '@/components/error-state';
import { LoadingState } from '@/components/loading-state';

type MeetingDetailViewProps = {
  meetingId: string;
};

const createStatusComponent = (
  data: MeetingGetOne,
  meetingId: string,
  onCancel?: () => void,
  isCancelling?: boolean
) => {
  switch (data.status) {
    case MeetingStatus.UPCOMING:
      return (
        <UpcomingState
          meetingId={meetingId}
          onCancel={onCancel}
          isCancelling={isCancelling}
        />
      );
    case MeetingStatus.ACTIVE:
      return <ActiveState meetingId={meetingId} />;
    case MeetingStatus.COMPLETED:
      return <CompletedState data={data} />;
    case MeetingStatus.PROCESSING:
      return <ProcessingState />;
    case MeetingStatus.CANCELLED:
      return <CancelledState />;
    default:
      return null;
  }
};

export function MeetingDetailView({ meetingId }: MeetingDetailViewProps) {
  const [isUpdateMeetingDialogOpen, setIsUpdateMeetingDialogOpen] =
    useState(false);

  const router = useRouter();
  const trpc = useTRPC();
  const queryClient = useQueryClient();

  const { data } = useSuspenseQuery(
    trpc.meetings.getOne.queryOptions({ id: meetingId })
  );

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

  const handleEdit = useCallback(() => {
    setIsUpdateMeetingDialogOpen(true);
  }, []);

  const handleRemoveMeeting = useCallback(async () => {
    const confirmed = await confirmRemoveMeeting();
    if (!confirmed) return;
    removeMeeting({ id: meetingId });
  }, [confirmRemoveMeeting, removeMeeting, meetingId]);

  const [isCancelling, setIsCancelling] = useState(false);

  const handleCancelMeeting = useCallback(async () => {
    setIsCancelling(true);
    try {
      toast.success('Meeting cancelled successfully');
    } catch (error) {
      toast.error('Failed to cancel meeting');
    } finally {
      setIsCancelling(false);
    }
  }, [meetingId]);

  const statusComponent = useMemo(() => {
    return createStatusComponent(
      data,
      meetingId,
      handleCancelMeeting,
      isCancelling
    );
  }, [data, meetingId, handleCancelMeeting, isCancelling]);

  const breadcrumbPaths = useMemo(
    () => [{ title: data.name, link: `/meetings/${meetingId}` }],
    [data.name, meetingId]
  );

  return (
    <div className='flex flex-col gap-4'>
      <DetailViewHeader
        root={{ title: 'Meetings', link: '/meetings' }}
        paths={breadcrumbPaths}
        onEdit={handleEdit}
        onDelete={handleRemoveMeeting}
      />

      <div className='bg-background overflow-hidden rounded-lg border'>
        <div className='col-span-5 flex flex-col gap-y-5 px-4 py-5'>
          {statusComponent}
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
