'use client';

import { useState } from 'react';
import { PlusIcon, XCircleIcon, XIcon } from 'lucide-react';
import { DEFAULT_PAGE } from '@/config/constants';
import { useAgentsFilter } from '@/modules/agents/hooks/use-agents-filter';
import { AgentsSearch } from '@/modules/agents/ui/components/agents-search';
import NewAgentsDialog from '@/modules/agents/ui/components/new-agent-dialog';
import { Button } from '@/components/ui/button';

export default function AgentsListHeader() {
  const [filter, setFilter] = useAgentsFilter();
  const [open, setOpen] = useState(false);

  const isAnyFilterModified = !!filter.search;

  const onClearFilters = () => {
    setFilter({
      page: DEFAULT_PAGE,
      search: ''
    });
  };

  return (
    <>
      <div className='flex flex-col gap-y-4'>
        <div className='flex items-center justify-between'>
          <h1 className='text-2xl font-bold tracking-tight'>Agents</h1>
          <div className='flex items-center gap-x-2'>
            <Button onClick={() => setOpen(true)}>
              <PlusIcon className='h-4 w-4' />
              New Agent
            </Button>
          </div>
        </div>
        <div className='flex items-center gap-x-2 p-1'>
          <AgentsSearch />
          {isAnyFilterModified && (
            <Button
              variant='ghost'
              size='sm'
              onClick={onClearFilters}
              className='h-9'
            >
              <XCircleIcon className='size-4' />
              Clear
            </Button>
          )}
        </div>
      </div>
      <NewAgentsDialog open={open} onOpenChange={setOpen} />
    </>
  );
}
