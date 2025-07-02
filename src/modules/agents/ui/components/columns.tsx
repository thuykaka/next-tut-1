'use client';

import { ColumnDef } from '@tanstack/react-table';
import { CornerDownRightIcon, VideoIcon } from 'lucide-react';
import { AgentGetOne } from '@/modules/agents/types';
import { Badge } from '@/components/ui/badge';
import { GeneratedAvatar } from '@/components/generated-avatar';

export const columns: ColumnDef<AgentGetOne>[] = [
  {
    accessorKey: 'name',
    header: 'Agent Name',
    cell: ({ row }) => {
      return (
        <div className='flex flex-col gap-y-1'>
          <div className='flex items-center gap-x-2'>
            <GeneratedAvatar
              seed={row.original.name}
              variant='botttsNeutral'
              className='size-6'
            />
            <p className='font-semibold capitalize'>{row.original.name}</p>
          </div>

          <div className='flex items-center gap-x-2'>
            <div className='flex items-center gap-x-2'>
              <CornerDownRightIcon className='text-muted-foreground size-3' />
              <span className='text-muted-foreground max-w-[200px] truncate text-sm capitalize lg:max-w-[300px]'>
                {row.original.instructions}
              </span>
            </div>
          </div>
        </div>
      );
    }
  },
  {
    accessorKey: 'meetingCount',
    header: 'Meeting',
    cell: ({ row }) => {
      return (
        <Badge
          variant='outline'
          className='flex items-center gap-x-2 [&>svg]:size-4'
        >
          <VideoIcon className='text-blue-700' />
          {row.original.meetingCount}{' '}
          {row.original.meetingCount === 1 ? 'meeting' : 'meetings'}
        </Badge>
      );
    }
  }
];
