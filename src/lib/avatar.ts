import { initials, botttsNeutral } from '@dicebear/collection';
import { createAvatar } from '@dicebear/core';

type AvatarProps = {
  seed: string;
  variant?: 'initials' | 'botttsNeutral';
};

export function generateAvatar({ seed, variant = 'initials' }: AvatarProps) {
  let avatar;

  if (variant === 'initials') {
    avatar = createAvatar(initials, {
      seed,
      fontWeight: 500,
      fontSize: 42
    });
  } else {
    avatar = createAvatar(botttsNeutral, {
      seed
    });
  }

  return avatar.toDataUri();
}
