import { Spinner, type SpinnerProps } from '@/components/ui/kibo-ui/spinner';

type Props = {
  title?: string;
  description?: string;
} & SpinnerProps;

export function LoadingState({
  title,
  description = 'This may take a few seconds...',
  ...spinnerProps
}: Props) {
  return (
    <div className='flex flex-col items-center justify-center gap-4 md:min-h-[300px] md:min-w-[600px]'>
      <Spinner {...spinnerProps} className='text-primary' />
      <div className='flex flex-col gap-y-2 text-center'>
        {title && <h6 className='text-lg font-medium'>{title}</h6>}
        {description && (
          <p className='text-muted-foreground text-sm'>{description}</p>
        )}
      </div>
    </div>
  );
}
