import { botttsNeutral, initials } from '@dicebear/collection';
import { createAvatar } from '@dicebear/core';
import { cn } from '@/lib/utils';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

type GeneratedAvatarProps = {
  seed: string;
  className?: string;
  variant?: 'botttsNeutral' | 'initials';
};

export function GeneratedAvatar({
  seed,
  className,
  variant
}: GeneratedAvatarProps) {
  let avatar: ReturnType<typeof createAvatar>;

  if (variant === 'botttsNeutral') {
    avatar = createAvatar(botttsNeutral, {
      seed
    });
  } else {
    avatar = createAvatar(initials, {
      seed,
      fontWeight: 500,
      fontSize: 42
    });
  }

  return (
    <Avatar className={cn('h-8 w-8 rounded-full', className)}>
      <AvatarImage src={avatar.toDataUri()} alt='Avatar' />
      <AvatarFallback>{seed.charAt(0).toUpperCase()}</AvatarFallback>
    </Avatar>
  );
}
