import { useMemo, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useTRPC } from '@/trpc/client';
import { useMeetingsFilter } from '@/modules/meetings/hooks/use-meetings-filter';
import {
  Combobox,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxGroup,
  ComboboxInput,
  ComboboxItem,
  ComboboxList,
  ComboboxTrigger
} from '@/components/ui/kibo-ui/combobox';
import { GeneratedAvatar } from '@/components/generated-avatar';

export default function MeetingsAgentFilter() {
  const [filters, setFilters] = useMeetingsFilter();
  const [agentSearch, setAgentSearch] = useState('');

  const trpc = useTRPC();

  const agents = useQuery(
    trpc.agents.getMany.queryOptions({
      pageSize: 100,
      search: agentSearch
    })
  );

  const options = useMemo(() => {
    return (agents.data?.data ?? []).map((agent) => ({
      value: agent.id,
      label: agent.name,
      children: (
        <div className='flex items-center gap-x-2'>
          <GeneratedAvatar
            seed={agent.name}
            variant='botttsNeutral'
            className='size-4 border'
          />
          <span>{agent.name}</span>
        </div>
      )
    }));
  }, [agents.data?.data]);

  return (
    <Combobox
      value={filters.agentId}
      data={options}
      onValueChange={(value) => setFilters({ ...filters, agentId: value })}
      type='agent'
    >
      <ComboboxTrigger className='w-full md:w-[200px]' display='children' />
      <ComboboxContent shouldFilter={false}>
        <ComboboxInput onValueChange={setAgentSearch} />
        <ComboboxEmpty />
        <ComboboxList>
          <ComboboxGroup>
            {options.map((agent) => (
              <ComboboxItem key={agent.value} value={agent.value}>
                {agent.children}
              </ComboboxItem>
            ))}
          </ComboboxGroup>
        </ComboboxList>
      </ComboboxContent>
    </Combobox>
  );
}
