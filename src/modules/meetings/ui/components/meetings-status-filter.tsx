import { useMeetingsFilter } from '@/modules/meetings/hooks/use-meetings-filter';
import {
  Combobox,
  ComboboxItem,
  ComboboxGroup,
  ComboboxList,
  ComboboxContent,
  ComboboxTrigger,
  ComboboxInput,
  ComboboxEmpty
} from '@/components/ui/kibo-ui/combobox';
import { MeetingStatus } from '../../types';
import { STATUS_OPTIONS } from './config';

export default function MeetingsStatusFilter() {
  const [filters, setFilters] = useMeetingsFilter();
  return (
    <Combobox
      value={filters.status ?? ''}
      data={STATUS_OPTIONS}
      onValueChange={(value) =>
        setFilters({ ...filters, status: value as MeetingStatus })
      }
      type='status'
    >
      <ComboboxTrigger className='w-full md:w-[200px]' display='children' />
      <ComboboxContent>
        <ComboboxInput />
        <ComboboxEmpty />
        <ComboboxList>
          <ComboboxGroup>
            {STATUS_OPTIONS.map((status) => (
              <ComboboxItem key={status.value} value={status.value}>
                <div className='flex items-center gap-x-2'>
                  {status.children}
                </div>
              </ComboboxItem>
            ))}
          </ComboboxGroup>
        </ComboboxList>
      </ComboboxContent>
    </Combobox>
  );
}
