import { AlertCircleIcon } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

type Props = {
  title?: string;
  description?: string;
};

export function ErrorState({ title, description }: Props) {
  return (
    <div className='flex h-screen flex-col items-center justify-center gap-4'>
      <Alert
        variant='destructive'
        className='flex flex-col items-center border-none'
      >
        <AlertCircleIcon className='mb-4' />
        <AlertTitle className='text-lg font-medium'>{title}</AlertTitle>
        <AlertDescription className='text-muted-foreground text-sm'>
          {description}
        </AlertDescription>
      </Alert>
    </div>
  );
}
