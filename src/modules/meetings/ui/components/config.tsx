import {
  CircleCheckIcon,
  ClockArrowUpIcon,
  LoaderIcon,
  CircleXIcon
} from 'lucide-react';
import { MeetingStatus } from '@/modules/meetings/types';

export const STATUS_ICON_MAP = {
  [MeetingStatus.UPCOMING]: ClockArrowUpIcon,
  [MeetingStatus.ACTIVE]: LoaderIcon,
  [MeetingStatus.COMPLETED]: CircleCheckIcon,
  [MeetingStatus.PROCESSING]: LoaderIcon,
  [MeetingStatus.CANCELLED]: CircleXIcon
};

export const STATUS_COLOR_MAP = {
  [MeetingStatus.UPCOMING]:
    'bg-yellow-500/20 text-yellow-800 border-yellow-800/5',
  [MeetingStatus.ACTIVE]: 'bg-blue-500/20 text-blue-800 border-blue-800/5',
  [MeetingStatus.COMPLETED]:
    'bg-emerald-500/20 text-emerald-800 border-emerald-800/5',
  [MeetingStatus.PROCESSING]: 'bg-gray-300/20 text-gray-800 border-gray-800/5',
  [MeetingStatus.CANCELLED]: 'bg-rose-500/20 text-rose-800 border-rose-800/5'
};

export const STATUS_OPTIONS: {
  value: MeetingStatus;
  label: string;
  children: React.ReactNode;
}[] = [
  {
    value: MeetingStatus.UPCOMING,
    label: MeetingStatus.UPCOMING,
    children: (
      <div className='flex items-center gap-x-2 capitalize'>
        <STATUS_ICON_MAP.upcoming className='size-4' />
        {MeetingStatus.UPCOMING}
      </div>
    )
  },
  {
    value: MeetingStatus.PROCESSING,
    label: MeetingStatus.PROCESSING,
    children: (
      <div className='flex items-center gap-x-2 capitalize'>
        <STATUS_ICON_MAP.processing className='size-4' />
        {MeetingStatus.PROCESSING}
      </div>
    )
  },
  {
    value: MeetingStatus.ACTIVE,
    label: MeetingStatus.ACTIVE,
    children: (
      <div className='flex items-center gap-x-2 capitalize'>
        <STATUS_ICON_MAP.active className='size-4' />
        {MeetingStatus.ACTIVE}
      </div>
    )
  },
  {
    label: MeetingStatus.COMPLETED,
    value: MeetingStatus.COMPLETED,
    children: (
      <div className='flex items-center gap-x-2 capitalize'>
        <STATUS_ICON_MAP.completed className='size-4' />
        {MeetingStatus.COMPLETED}
      </div>
    )
  },
  {
    label: MeetingStatus.CANCELLED,
    value: MeetingStatus.CANCELLED,
    children: (
      <div className='flex items-center gap-x-2 capitalize'>
        <STATUS_ICON_MAP.cancelled className='size-4' />
        {MeetingStatus.CANCELLED}
      </div>
    )
  }
];
