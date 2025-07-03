import Image from 'next/image';

type Props = {
  title?: string;
  description?: string;
  imageLink?: string;
};

export function EmptyState({
  title,
  description,
  imageLink = '/empty.svg'
}: Props) {
  return (
    <div className='flex min-h-[400px] flex-col items-center justify-center gap-4'>
      <Image src={imageLink} alt='Empty' width={240} height={240} />
      <div className='mx-auto flex max-w-md flex-col gap-y-2 text-center'>
        {title && <h6 className='text-lg font-medium'>{title}</h6>}
        {description && (
          <p className='text-muted-foreground text-sm'>{description}</p>
        )}
      </div>
    </div>
  );
}
