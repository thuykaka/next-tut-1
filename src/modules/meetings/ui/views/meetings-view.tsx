'use client';

import { useSuspenseQuery } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { useTRPC } from '@/trpc/client';
import { useMeetingsFilter } from '@/modules/meetings/hooks/use-meetings-filter';
import { MeetingGetMany } from '@/modules/meetings/types';
import { columns } from '@/modules/meetings/ui/components/columns';
import { DataTable } from '@/components/data-table';
import { DataTablePagination } from '@/components/data-table-pagination';
import { EmptyState } from '@/components/empty-state';
import { ErrorState } from '@/components/error-state';
import { LoadingState } from '@/components/loading-state';

export function MeetingsView() {
  const router = useRouter();
  const [filters, setFilters] = useMeetingsFilter();

  const trpc = useTRPC();
  const { data } = useSuspenseQuery(
    trpc.meetings.getMany.queryOptions({ ...filters })
  );

  const handleRowClick = (row: MeetingGetMany['data'][number]) => {
    router.push(`/meetings/${row.id}`);
  };

  return (
    <div>
      <DataTable
        columns={columns}
        data={data.data}
        onRowClick={handleRowClick}
      />
      <DataTablePagination
        page={filters.page}
        totalPages={data.totalPages}
        onPageChange={(page) => setFilters({ ...filters, page })}
      />
      {data.total === 0 && (
        <EmptyState
          title='No meetings found'
          description='Schedule a meeting to connect with others. Each meeting lets you collaborate, share ideas, and interact with participants in real-time.'
        />
      )}
    </div>
  );
}

export function MeetingsViewLoading() {
  return <LoadingState title='Loading Meetings' />;
}

export function MeetingsViewError() {
  return <ErrorState title='Failed to load meetings' />;
}
