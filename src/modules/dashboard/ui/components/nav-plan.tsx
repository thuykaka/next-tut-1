'use client';

import { type LucideIcon } from 'lucide-react';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem
} from '@/components/ui/sidebar';

export function NavPlans({
  plans
}: {
  plans: {
    name: string;
    url: string;
    icon: LucideIcon;
  }[];
}) {
  const pathname = usePathname();

  return (
    <SidebarGroup className='group-data-[collapsible=icon]:hidden'>
      <SidebarGroupLabel>Plans</SidebarGroupLabel>
      <SidebarMenu>
        {plans.map((item) => (
          <SidebarMenuItem key={item.name}>
            <SidebarMenuButton
              asChild
              className={cn(
                'from-sidebar-accent via-sidebar/50 to-sidebar/50 h-10 border border-transparent from-5% via-30% hover:border-[#5d6b68]/10 hover:bg-linear-to-r/oklch',
                pathname === item.url &&
                  'border-[#5d6b68]/10 bg-linear-to-r/oklch'
              )}
              isActive={pathname === item.url}
            >
              <a href={item.url}>
                <item.icon />
                <span>{item.name}</span>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        ))}
      </SidebarMenu>
    </SidebarGroup>
  );
}
