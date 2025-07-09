import { VideoIcon, BanIcon } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { EmptyState } from '@/components/empty-state';

type UpcomingStateProps = {
  meetingId: string;
};

export default function UpcomingState({ meetingId }: UpcomingStateProps) {
  return (
    <div className='flex flex-col items-center justify-center'>
      <EmptyState
        title='Not started yet'
        description='One you start the meeting, you will be able to see the summary here.'
        imageLink='/upcoming.svg'
      />
      <div className='mb-10 flex w-full flex-col-reverse items-center gap-4 lg:flex-row lg:justify-center'>
        <Button asChild className='w-full lg:w-auto'>
          <Link href={`/call/${meetingId}`}>
            <VideoIcon className='size-4' />
            Start Meeting
          </Link>
        </Button>
      </div>
    </div>
  );
}
