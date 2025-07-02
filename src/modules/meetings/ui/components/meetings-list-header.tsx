'use client';

import { useState } from 'react';
import { PlusIcon, XCircleIcon, XIcon } from 'lucide-react';
import { DEFAULT_PAGE } from '@/config/constants';
import { AgentsSearch } from '@/modules/agents/ui/components/agents-search';
import { useMeetingsFilter } from '@/modules/meetings/hooks/use-meetings-filter';
import NewMeetingDialog from '@/modules/meetings/ui/components/new-meeting-dialog';
import { Button } from '@/components/ui/button';

export default function MeetingsListHeader() {
  const [filter, setFilter] = useMeetingsFilter();
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
          <h1 className='text-2xl font-bold tracking-tight'>Meetings</h1>
          <div className='flex items-center gap-x-2'>
            <Button onClick={() => setOpen(true)}>
              <PlusIcon className='h-4 w-4' />
              New Meeting
            </Button>
          </div>
        </div>
        <div className='flex items-center gap-x-2 p-1'>TODO: Add search</div>
      </div>
      <NewMeetingDialog open={open} onOpenChange={setOpen} />
    </>
  );
}
