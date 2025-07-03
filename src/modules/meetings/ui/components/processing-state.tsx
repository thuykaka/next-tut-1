import { EmptyState } from '@/components/empty-state';

export default function ProcessingState() {
  return (
    <div className='flex flex-col items-center justify-center'>
      <EmptyState
        title='Meeting completed'
        description='The meeting has been completed and the summary will be available soon.'
        imageLink='/processing.svg'
      />
    </div>
  );
}
