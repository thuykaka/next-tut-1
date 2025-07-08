'use client';

import * as React from 'react';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail
} from '@/components/ui/sidebar';
import DashboardTrial from './dashboard-trial';
import { NavMain } from './nav-main';
import { NavPlans } from './nav-plan';
import { NavUser } from './nav-user';
import { TeamSwitcher } from './team-switcher';

export function DashboardSidebar({
  ...props
}: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible='icon' {...props}>
      <SidebarHeader>
        <TeamSwitcher />
      </SidebarHeader>
      <SidebarContent className='sidebar-scrollbar'>
        <NavMain />
        <NavPlans />
      </SidebarContent>
      <SidebarFooter>
        <DashboardTrial />
        <NavUser />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
