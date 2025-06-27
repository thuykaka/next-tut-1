import { Spinner } from '@/components/ui/kibo-ui/spinner';

export default function Loading() {
  return (
    <div className='bg-muted flex min-h-svh flex-col items-center justify-center p-6 md:p-10'>
      <Spinner className='mx-auto' />
    </div>
  );
}
