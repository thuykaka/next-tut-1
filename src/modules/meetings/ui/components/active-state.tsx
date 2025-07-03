import { VideoIcon } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { EmptyState } from '@/components/empty-state';

type ActiveStateProps = {
  meetingId: string;
};

export default function ActiveState({ meetingId }: ActiveStateProps) {
  return (
    <div className='flex flex-col items-center justify-center'>
      <EmptyState
        title='Meeting is active'
        description='Meeting will end once all participants have left.'
        imageLink='/upcoming.svg'
      />
      <div className='mb-10 flex w-full flex-col-reverse items-center gap-4 lg:flex-row lg:justify-center'>
        <Button asChild className='w-full lg:w-auto'>
          <Link href={`/calls/${meetingId}`}>
            <VideoIcon className='size-4' />
            Join Meeting
          </Link>
        </Button>
      </div>
    </div>
  );
}
