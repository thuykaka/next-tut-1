'use client';

import { useState } from 'react';
import { PlusIcon, XCircleIcon, XIcon } from 'lucide-react';
import { DEFAULT_PAGE } from '@/config/constants';
import { useMeetingsFilter } from '@/modules/meetings/hooks/use-meetings-filter';
import MeetingsSearch from '@/modules/meetings/ui/components/meetings-search';
import MeetingsStatusFilter from '@/modules/meetings/ui/components/meetings-status-filter';
import NewMeetingDialog from '@/modules/meetings/ui/components/new-meeting-dialog';
import { Button } from '@/components/ui/button';
import MeetingsAgentFilter from './meetings-agent-filter';

export default function MeetingsListHeader() {
  const [filter, setFilter] = useMeetingsFilter();
  const [open, setOpen] = useState(false);

  const isAnyFilterModified =
    !!filter.search || !!filter.agentId || !!filter.status;

  const onClearFilters = () => {
    setFilter({
      page: DEFAULT_PAGE,
      search: '',
      status: null,
      agentId: ''
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
        <div className='flex flex-wrap items-center gap-2 p-1'>
          <MeetingsSearch />
          <MeetingsStatusFilter />
          <MeetingsAgentFilter />

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
      <NewMeetingDialog open={open} onOpenChange={setOpen} />
    </>
  );
}
