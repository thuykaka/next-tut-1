'use client';

import { useSuspenseQuery } from '@tanstack/react-query';
import { useTRPC } from '@/trpc/client';
import { useAgentsFilter } from '@/modules/agents/hooks/use-agents-filter';
import { columns } from '@/modules/agents/ui/components/columns';
import { DataTable } from '@/modules/agents/ui/components/data-table';
import { DataTablePagination } from '@/modules/agents/ui/components/data-table-pagination';
import { EmptyState } from '@/components/empty-state';
import { ErrorState } from '@/components/error-state';
import { LoadingState } from '@/components/loading-state';

export function AgentsView() {
  const [filters, setFilters] = useAgentsFilter();

  const trpc = useTRPC();

  const { data } = useSuspenseQuery(
    trpc.agents.getMany.queryOptions({ ...filters })
  );

  return (
    <div>
      <DataTable columns={columns} data={data.data} />
      <DataTablePagination
        page={filters.page}
        totalPages={data.totalPages}
        onPageChange={(page) => setFilters({ ...filters, page })}
      />
      {data.total === 0 && (
        <EmptyState
          title='Create your first agent'
          description='Agents are the core of your AI-powered meetings. They help you manage your meetings and ensure that you are always on top of your game.'
        />
      )}
    </div>
  );
}

export function AgentsViewLoading() {
  return (
    <LoadingState
      title='Loading Agents'
      description='This may take a few seconds...'
    />
  );
}

export function AgentsViewError() {
  return (
    <ErrorState
      title='Failed to load agents'
      description='Something went wrong. Please try again later.'
    />
  );
}
