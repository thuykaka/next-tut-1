'use client';

import { format } from 'date-fns';
import { ColumnDef } from '@tanstack/react-table';
import { CornerDownRightIcon, ClockFadingIcon } from 'lucide-react';
import { formatDuration } from '@/lib/format';
import { cn } from '@/lib/utils';
import { MeetingGetMany } from '@/modules/meetings/types';
import { Badge } from '@/components/ui/badge';
import { GeneratedAvatar } from '@/components/generated-avatar';
import { STATUS_ICON_MAP, STATUS_COLOR_MAP } from './config';

export const columns: ColumnDef<MeetingGetMany['data'][number]>[] = [
  {
    accessorKey: 'name',
    header: 'Meeting Name',
    cell: ({ row }) => {
      return (
        <div className='flex flex-col gap-y-1'>
          <span className='font-semibold capitalize'>{row.original.name}</span>
          <div className='flex items-center gap-x-2'>
            <div className='flex items-center gap-x-2'>
              <CornerDownRightIcon className='text-muted-foreground size-3' />
              <GeneratedAvatar
                seed={row.original.agent.name}
                variant='botttsNeutral'
                className='size-4'
              />
              <span className='text-muted-foreground max-w-[200px] truncate text-sm capitalize lg:max-w-[300px]'>
                {row.original.agent.name}
              </span>
            </div>
            <span className='text-muted-foreground text-sm'>
              {row.original.startedAt
                ? format(row.original.startedAt, 'MMM d')
                : ''}
            </span>
          </div>
        </div>
      );
    }
  },
  {
    accessorKey: 'status',
    header: 'Status',
    cell: ({ row }) => {
      const status = row.original.status;
      const Icon = STATUS_ICON_MAP[status as keyof typeof STATUS_ICON_MAP];

      return (
        <Badge
          variant='outline'
          className={cn(
            'text-muted-foreground capitalize [&>svg]:size-4',
            STATUS_COLOR_MAP[status as keyof typeof STATUS_COLOR_MAP]
          )}
        >
          <Icon className={cn(status === 'processing' && 'animate-spin')} />
          {status}
        </Badge>
      );
    }
  },
  {
    accessorKey: 'duration',
    header: 'Duration',
    cell: ({ row }) => {
      return (
        <Badge
          variant='outline'
          className='flex items-center gap-x-2 capitalize [&>svg]:size-4'
        >
          <ClockFadingIcon className='text-blue-700' />
          {row.original.duration
            ? formatDuration(row.original.duration)
            : 'N/A'}
        </Badge>
      );
    }
  }
];
