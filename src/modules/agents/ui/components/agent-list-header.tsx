'use client';

import { useState } from 'react';
import { PlusIcon } from 'lucide-react';
import NewAgentsDialog from '@/modules/agents/ui/components/new-agent-dialog';
import { Button } from '@/components/ui/button';

export default function AgentsListHeader() {
  const [open, setOpen] = useState(false);

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
      </div>
      <NewAgentsDialog open={open} onOpenChange={setOpen} />
    </>
  );
}
