import { EmptyState } from '@/components/empty-state';

export default function CancelledState() {
  return (
    <div className='flex flex-col items-center justify-center'>
      <EmptyState
        title='Meeting was cancelled'
        description='Meeting was cancelled by the host.'
        imageLink='/cancelled.svg'
      />
    </div>
  );
}
