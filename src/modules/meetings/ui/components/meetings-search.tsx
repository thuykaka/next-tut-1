import { useState, useEffect } from 'react';
import { SearchIcon } from 'lucide-react';
import { useDebouncedCallback } from '@/hooks/use-debounced-callback';
import { useMeetingsFilter } from '@/modules/meetings/hooks/use-meetings-filter';
import { Input } from '@/components/ui/input';

export default function MeetingsSearch() {
  const [filter, setFilter] = useMeetingsFilter();
  const [localSearch, setLocalSearch] = useState(filter.search || '');

  // Sync local state with filter when it changes externally
  useEffect(() => {
    setLocalSearch(filter.search || '');
  }, [filter.search]);

  const debouncedSetSearch = useDebouncedCallback((search: string) => {
    setFilter({ ...filter, search });
  }, 300);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    // Update local state immediately for responsive UI
    setLocalSearch(value);
    // Debounce the actual search update
    debouncedSetSearch(value);
  };

  return (
    <div className='relative w-full md:w-auto'>
      <SearchIcon className='text-muted-foreground absolute top-1/2 left-2 h-4 w-4 -translate-y-1/2' />
      <Input
        className='bg-background h-9 w-full pl-10 md:w-[250px]'
        placeholder='Search meetings...'
        value={localSearch}
        onChange={handleSearchChange}
      />
    </div>
  );
}
