'use client';

import {
  BadgeCheck,
  Bell,
  ChevronsUpDown,
  CreditCard,
  LogOut,
  Sparkles
} from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { authClient } from '@/lib/auth-client';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar
} from '@/components/ui/sidebar';
import { Skeleton } from '@/components/ui/skeleton';

function UserAvatar({ image, name }: { image?: string | null; name: string }) {
  return (
    <Avatar className='h-8 w-8 rounded-lg'>
      <AvatarImage
        src={image || 'https://ui.shadcn.com/avatars/shadcn.jpg'}
        alt={name}
      />
      <AvatarFallback className='rounded-lg'>
        {name.charAt(0).toUpperCase()}
      </AvatarFallback>
    </Avatar>
  );
}

function UserSkeleton() {
  return (
    <div className='flex items-center space-x-4'>
      <Skeleton className='bg-sidebar-accent size-8 rounded-full' />
      <div className='space-y-2'>
        <Skeleton className='bg-sidebar-accent h-3 w-[100px]' />
        <Skeleton className='bg-sidebar-accent h-3 w-[150px]' />
      </div>
    </div>
  );
}

export function NavUser() {
  const { isMobile } = useSidebar();
  const router = useRouter();
  const { data: session, isPending } = authClient.useSession();

  if (isPending || !session?.user) {
    return <UserSkeleton />;
  }

  const onSignOut = () => {
    authClient.signOut({
      fetchOptions: {
        onSuccess: () => {
          router.push('/sign-in');
        }
      }
    });
  };

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger
            asChild
            className='border-border/10 flex w-full items-center justify-between overflow-hidden rounded-lg border bg-white/5 p-3 !ring-0 hover:bg-white/10'
          >
            <SidebarMenuButton
              size='lg'
              className='data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground'
            >
              <UserAvatar image={session.user.image} name={session.user.name} />
              <div className='grid flex-1 text-left text-sm leading-tight'>
                <span className='truncate font-medium'>
                  {session.user.name}
                </span>
                <span className='truncate text-xs'>{session.user.email}</span>
              </div>
              <ChevronsUpDown className='ml-auto size-4' />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className='w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg'
            side={isMobile ? 'bottom' : 'right'}
            align='end'
            sideOffset={4}
          >
            <DropdownMenuLabel className='p-0 font-normal'>
              <div className='flex items-center gap-2 px-1 py-1.5 text-left text-sm'>
                <UserAvatar
                  image={session.user.image}
                  name={session.user.name}
                />
                <div className='grid flex-1 text-left text-sm leading-tight'>
                  <span className='truncate font-medium'>
                    {session.user.name}
                  </span>
                  <span className='truncate text-xs'>{session.user.email}</span>
                </div>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem>
                <Link
                  href='/dashboard/billing'
                  className='flex w-full items-center gap-2'
                >
                  <Sparkles />
                  Upgrade to Pro
                </Link>
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem>
                <BadgeCheck />
                Account
              </DropdownMenuItem>
              <DropdownMenuItem>
                <CreditCard />
                Billing
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Bell />
                Notifications
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={onSignOut} className='cursor-pointer'>
              <LogOut />
              Log out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
