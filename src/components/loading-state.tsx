import { Spinner, type SpinnerProps } from '@/components/ui/kibo-ui/spinner';

type Props = {
  title?: string;
  description?: string;
} & SpinnerProps;

export function LoadingState({ title, description, variant }: Props) {
  return (
    <div className='flex h-screen flex-col items-center justify-center gap-4'>
      <Spinner variant={variant} className='text-primary' />
      <div className='flex flex-col gap-y-2 text-center'>
        {title && <h6 className='text-lg font-medium'>{title}</h6>}
        {description && (
          <p className='text-muted-foreground text-sm'>{description}</p>
        )}
      </div>
    </div>
  );
}
