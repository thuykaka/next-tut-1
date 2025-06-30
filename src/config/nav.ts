import {
  Bot,
  AudioWaveform,
  Command,
  GalleryVerticalEnd,
  VideoIcon,
  Settings2,
  Sparkles,
  CreditCard,
  type LucideIcon
} from 'lucide-react';

export type NavItem = {
  title: string;
  url: string;
  icon: LucideIcon | React.ElementType;
  isActive?: boolean;
  shortcut?: [string, string];
  items?: Omit<NavItem, 'icon'>[];
};

export type NavTeamItem = {
  name: string;
  logo: LucideIcon;
  plan: string;
};

export const navMainConfig: NavItem[] = [
  {
    title: 'Meetings',
    url: '/meetings',
    icon: VideoIcon,
    isActive: true,
    shortcut: ['m', 'm']
  },
  {
    title: 'Agents',
    url: '/agents',
    icon: Bot,
    shortcut: ['a', 'a']
  },
  {
    title: 'Settings',
    url: '#',
    icon: Settings2,
    items: [
      {
        title: 'General',
        url: '/settings/general',
        shortcut: ['g', 'g']
      },
      {
        title: 'Team',
        url: '/settings/team',
        shortcut: ['t', 't']
      },
      {
        title: 'Billing',
        url: '/settings/billing',
        shortcut: ['b', 'b']
      },
      {
        title: 'Limits',
        url: '/settings/limits',
        shortcut: ['l', 'l']
      }
    ]
  }
];

export const navPlansConfig: NavItem[] = [
  {
    title: 'Upgrade Plan',
    url: '/plans',
    icon: Sparkles,
    shortcut: ['u', 'u']
  },
  {
    title: 'Payment History',
    url: '/payment-history',
    icon: CreditCard,
    shortcut: ['p', 'p']
  }
];

export const navTeamConfig: NavTeamItem[] = [
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
];
