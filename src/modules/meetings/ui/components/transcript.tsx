import { useState, useCallback } from 'react';
import { format } from 'date-fns';
import { useQuery } from '@tanstack/react-query';
import { SearchIcon } from 'lucide-react';
import Highlighter from 'react-highlight-words';
import { useTRPC } from '@/trpc/client';
import { generateAvatar } from '@/lib/avatar';
import { Avatar, AvatarImage } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Skeleton } from '@/components/ui/skeleton';

type TranscriptProps = {
  meetingId: string;
};

export default function Transcript({ meetingId }: TranscriptProps) {
  const trpc = useTRPC();

  const { data, isPending } = useQuery(
    trpc.meetings.getTranscript.queryOptions({ id: meetingId })
  );

  const [searchQuery, setSearchQuery] = useState('');
  const filteredData = (data ?? []).filter((item) =>
    item.text.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSearch = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  }, []);

  if (isPending) {
    return (
      <div className='flex w-full flex-col gap-y-4 bg-white p-3'>
        <p className='text-sm font-medium'>Transcript</p>
        <div className='flex flex-col gap-y-4'>
          <Skeleton className='h-3 w-full' />
          <Skeleton className='h-3 w-full' />
          <Skeleton className='h-3 w-full' />
        </div>
      </div>
    );
  }

  return (
    <div className='flex w-full flex-col gap-y-4 bg-white p-3'>
      <p className='text-sm font-medium'>Transcript</p>
      <div className='relative'>
        <Input
          placeholder='Search transcript'
          className='h-9 w-[240px] pl-7'
          value={searchQuery}
          onChange={handleSearch}
        />
        <SearchIcon className='text-muted-foreground absolute top-1/2 left-2 size-4 -translate-y-1/2' />
      </div>
      <ScrollArea>
        <div className='flex flex-col gap-y-4'>
          {filteredData.map((item, index) => (
            <div
              key={item.start_ts}
              className='hover:bg-muted flex flex-col gap-y-2 rounded-md border p-4'
            >
              <div className='flex items-center gap-x-2'>
                <Avatar className='size-6'>
                  <AvatarImage
                    src={
                      item.user.image ??
                      generateAvatar({
                        seed: item.user.name,
                        variant: 'initials'
                      })
                    }
                  />
                </Avatar>
                <p className='text-sm font-medium'>{item.user.name}</p>
                <p className='text-sm font-medium text-blue-500'>
                  {format(new Date(0, 0, 0, 0, 0, 0, item.start_ts), 'mm:ss')}
                </p>
              </div>
              <Highlighter
                searchWords={[searchQuery]}
                textToHighlight={item.text}
                highlightClassName='bg-yellow-200'
                className='text-sm text-neutral-700'
                autoEscape={true}
              />
            </div>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
}
