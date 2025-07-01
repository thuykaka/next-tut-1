import { SearchIcon } from 'lucide-react';
import { useAgentsFilter } from '@/modules/agents/hooks/use-agents-filter';
import { Input } from '@/components/ui/input';

export const AgentsSearch = () => {
  const [filter, setFilter] = useAgentsFilter();

  return (
    <div className='relative'>
      <SearchIcon className='text-muted-foreground absolute top-1/2 left-2 h-4 w-4 -translate-y-1/2' />
      <Input
        className='bg-background h-9 w-[250px] pl-10'
        placeholder='Search agents...'
        value={filter.search}
        onChange={(e) => setFilter({ ...filter, search: e.target.value })}
      />
    </div>
  );
};
