'use client';

import { navPlansConfig } from '@/config/nav';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem
} from '@/components/ui/sidebar';

export function NavPlans() {
  const pathname = usePathname();

  return (
    <SidebarGroup className='group-data-[collapsible=icon]:hidden'>
      <SidebarGroupLabel>Plans</SidebarGroupLabel>
      <SidebarMenu>
        {navPlansConfig.map((navItem) => (
          <SidebarMenuItem key={navItem.title}>
            <SidebarMenuButton
              asChild
              className={cn(
                'from-sidebar-accent via-sidebar/50 to-sidebar/50 h-10 border border-transparent from-5% via-30% hover:border-[#5d6b68]/10 hover:bg-linear-to-r/oklch',
                pathname === navItem.url &&
                  'border-[#5d6b68]/10 bg-linear-to-r/oklch'
              )}
              isActive={pathname === navItem.url}
            >
              <Link
                href={navItem.url}
                className='flex w-full items-center gap-2'
              >
                <navItem.icon />
                <span>{navItem.title}</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        ))}
      </SidebarMenu>
    </SidebarGroup>
  );
}
