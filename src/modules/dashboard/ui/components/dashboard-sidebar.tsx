'use client';

import * as React from 'react';
import {
  AudioWaveform,
  Bot,
  Command,
  GalleryVerticalEnd,
  CreditCard,
  Settings2,
  Sparkles,
  VideoIcon
} from 'lucide-react';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail
} from '@/components/ui/sidebar';
import { NavMain } from './nav-main';
import { NavPlans } from './nav-plan';
import { NavUser } from './nav-user';
import { TeamSwitcher } from './team-switcher';

const data = {
  teams: [
    {
      name: 'Meet.AI',
      logo: GalleryVerticalEnd,
      plan: 'Enterprise'
    },
    {
      name: 'Acme Corp.',
      logo: AudioWaveform,
      plan: 'Startup'
    },
    {
      name: 'Evil Corp.',
      logo: Command,
      plan: 'Free'
    }
  ],
  navMain: [
    {
      title: 'Meetings',
      url: '/meetings',
      icon: VideoIcon,
      isActive: true
    },
    {
      title: 'Agents',
      url: '/agents',
      icon: Bot
    },
    {
      title: 'Settings',
      url: '#',
      icon: Settings2,
      items: [
        {
          title: 'General',
          url: '#'
        },
        {
          title: 'Team',
          url: '#'
        },
        {
          title: 'Billing',
          url: '#'
        },
        {
          title: 'Limits',
          url: '#'
        }
      ]
    }
  ],
  plans: [
    {
      name: 'Upgrade Plan',
      url: '#',
      icon: Sparkles
    },
    {
      name: 'Payment History',
      url: '#',
      icon: CreditCard
    }
  ]
};

export function DashboardSidebar({
  ...props
}: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible='icon' {...props}>
      <SidebarHeader>
        <TeamSwitcher teams={data.teams} />
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
        <NavPlans plans={data.plans} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
