'use client';

import { navMainConfig } from '@/config/nav';
import { ChevronRight } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger
} from '@/components/ui/collapsible';
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem
} from '@/components/ui/sidebar';

export function NavMain() {
  const pathname = usePathname();

  return (
    <SidebarGroup>
      <SidebarGroupLabel>Features</SidebarGroupLabel>
      <SidebarMenu>
        {navMainConfig.map((navItem) => (
          <Collapsible
            key={navItem.title}
            asChild
            defaultOpen={navItem.isActive}
            className='group/collapsible'
          >
            <SidebarMenuItem>
              {navItem.items && navItem.items.length > 0 ? (
                <>
                  <CollapsibleTrigger asChild>
                    <SidebarMenuButton
                      tooltip={navItem.title}
                      className={cn(
                        'from-sidebar-accent via-sidebar/50 to-sidebar/50 h-10 border border-transparent from-5% via-30% hover:border-[#5d6b68]/10 hover:bg-linear-to-r/oklch',
                        pathname === navItem.url &&
                          'border-[#5d6b68]/10 bg-linear-to-r/oklch'
                      )}
                      isActive={pathname === navItem.url}
                    >
                      {navItem.icon && <navItem.icon />}
                      <span>{navItem.title}</span>
                      <ChevronRight className='ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90' />
                    </SidebarMenuButton>
                  </CollapsibleTrigger>
                  <CollapsibleContent>
                    <SidebarMenuSub>
                      {navItem.items?.map((subItem) => (
                        <SidebarMenuSubItem key={subItem.title}>
                          <SidebarMenuSubButton asChild>
                            <Link
                              href={subItem.url}
                              className='flex w-full items-center gap-2'
                            >
                              <span>{subItem.title}</span>
                            </Link>
                          </SidebarMenuSubButton>
                        </SidebarMenuSubItem>
                      ))}
                    </SidebarMenuSub>
                  </CollapsibleContent>
                </>
              ) : (
                <SidebarMenuButton
                  tooltip={navItem.title}
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
                    {navItem.icon && (
                      <navItem.icon className='size-4 shrink-0' />
                    )}
                    <span>{navItem.title}</span>
                  </Link>
                </SidebarMenuButton>
              )}
            </SidebarMenuItem>
          </Collapsible>
        ))}
      </SidebarMenu>
    </SidebarGroup>
  );
}
