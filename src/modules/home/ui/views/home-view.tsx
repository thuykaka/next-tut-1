'use client';

import { useRouter } from 'next/navigation';
import { authClient } from '@/lib/auth-client';
import { Button } from '@/components/ui/button';
import { Spinner } from '@/components/ui/kibo-ui/spinner';

export function HomeView() {
  const router = useRouter();
  const { data: session, isPending } = authClient.useSession();

  const onSignOut = () => {
    authClient.signOut({
      fetchOptions: {
        onSuccess: () => {
          router.push('/sign-in');
        }
      }
    });
  };

  if (isPending)
    return (
      <div className='flex min-h-svh flex-col items-center justify-center gap-4 p-6 md:p-10'>
        <span className='text-muted-foreground font-mono text-xs'>
          <Spinner className='mx-auto' />
          Loading in home view...
        </span>
      </div>
    );

  return (
    <div className='flex min-h-svh flex-col items-center justify-center gap-2 p-6 md:p-10'>
      Hello {session?.user?.email}
      <Button
        variant='destructive'
        type='button'
        className='w-[200px]'
        onClick={onSignOut}
      >
        Sign out
      </Button>
    </div>
  );
}
