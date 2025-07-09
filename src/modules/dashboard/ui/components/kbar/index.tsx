'use client';

import { useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import {
  KBarAnimator,
  KBarPortal,
  KBarPositioner,
  KBarProvider,
  KBarSearch,
  useRegisterActions,
  useKBar
} from 'kbar';
import { useRouter } from 'next/navigation';
import { useTRPC } from '@/trpc/client';
import RenderResults from './render-result';

export default function KBar({ children }: { children: React.ReactNode }) {
  return (
    <KBarProvider>
      <KBarComponent>{children}</KBarComponent>
    </KBarProvider>
  );
}

const KBarComponent = ({ children }: { children: React.ReactNode }) => {
  const { queryValue } = useKBar((state) => ({
    queryValue: state.searchQuery
  }));

  const router = useRouter();
  const trpc = useTRPC();

  const { data: agents } = useQuery(
    trpc.agents.getMany.queryOptions({ search: queryValue, pageSize: 100 })
  );

  const { data: meetings } = useQuery(
    trpc.meetings.getMany.queryOptions({ search: queryValue, pageSize: 100 })
  );

  const actions = useMemo(() => {
    const navigateTo = (url: string) => {
      router.push(url);
    };

    // Add some default actions
    const defaultActions = [
      {
        id: 'agents-section',
        name: 'Go to Agents',
        keywords: 'agents list',
        section: 'Navigation',
        subtitle: 'View all agents',
        perform: () => navigateTo('/agents')
      },
      {
        id: 'meetings-section',
        name: 'Go to Meetings',
        keywords: 'meetings list',
        section: 'Navigation',
        subtitle: 'View all meetings',
        perform: () => navigateTo('/meetings')
      }
    ];

    const agentActions = (agents?.data ?? []).map((item) => ({
      id: `agent-${item.id}`,
      name: item.name,
      keywords: item.name.toLowerCase(),
      section: 'Agents',
      subtitle: 'Go to Agent',
      perform: () => navigateTo(`/agents/${item.id}`)
    }));

    const meetingActions = (meetings?.data ?? []).map((item) => ({
      id: `meeting-${item.id}`,
      name: item.name,
      keywords: item.name.toLowerCase(),
      section: 'Meetings',
      subtitle: 'Go to Meeting',
      perform: () => navigateTo(`/meetings/${item.id}`)
    }));

    const allActions = [...agentActions, ...meetingActions, ...defaultActions];

    return allActions;
  }, [router, agents, meetings]);

  useRegisterActions(actions, [actions]);

  return (
    <>
      <KBarPortal>
        <KBarPositioner className='bg-background/80 fixed inset-0 z-99999 p-0! backdrop-blur-sm'>
          <KBarAnimator className='bg-card text-card-foreground relative mt-64! w-full max-w-[400px] -translate-y-12! overflow-hidden rounded-lg border shadow-lg lg:max-w-[600px]'>
            <div className='bg-card border-border sticky top-0 z-10 border-b'>
              <KBarSearch className='bg-card w-full border-none px-6 py-4 text-base outline-hidden focus:ring-0 focus:ring-offset-0 focus:outline-hidden' />
            </div>
            <div className='max-h-[400px]'>
              <RenderResults />
            </div>
          </KBarAnimator>
        </KBarPositioner>
      </KBarPortal>
      {children}
    </>
  );
};
