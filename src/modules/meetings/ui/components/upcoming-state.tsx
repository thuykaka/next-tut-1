import { VideoIcon, BanIcon } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { EmptyState } from '@/components/empty-state';

type UpcomingStateProps = {
  meetingId: string;
  onCancel?: () => void;
  isCancelling?: boolean;
};

export default function UpcomingState({
  meetingId,
  onCancel,
  isCancelling
}: UpcomingStateProps) {
  return (
    <div className='flex flex-col items-center justify-center'>
      <EmptyState
        title='Not started yet'
        description='One you start the meeting, you will be able to see the summary here.'
        imageLink='/upcoming.svg'
      />
      <div className='mb-10 flex w-full flex-col-reverse items-center gap-4 lg:flex-row lg:justify-center'>
        <Button
          variant='secondary'
          className='w-full lg:w-auto'
          onClick={() => onCancel?.()}
          disabled={!!isCancelling}
        >
          <BanIcon className='size-4' />
          Cancel Meeting
        </Button>
        <Button asChild className='w-full lg:w-auto'>
          <Link href={`/calls/${meetingId}`}>
            <VideoIcon className='size-4' />
            Start Meeting
          </Link>
        </Button>
      </div>
    </div>
  );
}
