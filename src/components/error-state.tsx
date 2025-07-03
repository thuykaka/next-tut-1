import { AlertCircleIcon } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

type Props = {
  title?: string;
  description?: string;
};

export function ErrorState({
  title,
  description = 'Something went wrong. Please try again later.'
}: Props) {
  return (
    <div className='flex flex-col items-center justify-center gap-4'>
      <Alert
        variant='destructive'
        className='flex flex-col items-center justify-center border-none md:min-h-[300px] md:min-w-[600px]'
      >
        <AlertCircleIcon className='mb-1' />
        <AlertTitle className='text-lg font-medium'>{title}</AlertTitle>
        <AlertDescription className='text-muted-foreground text-sm'>
          {description}
        </AlertDescription>
      </Alert>
    </div>
  );
}
