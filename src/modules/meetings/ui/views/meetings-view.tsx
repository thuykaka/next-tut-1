'use client';

import { useSuspenseQuery } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { useTRPC } from '@/trpc/client';
import { columns } from '@/modules/meetings/ui/components/columns';
import { DataTable } from '@/components/data-table';
import { EmptyState } from '@/components/empty-state';
import { ErrorState } from '@/components/error-state';
import { LoadingState } from '@/components/loading-state';

export function MeetingsView() {
  const router = useRouter();

  const trpc = useTRPC();
  const { data } = useSuspenseQuery(trpc.meetings.getMany.queryOptions());

  return (
    <div>
      <DataTable columns={columns} data={data.data} />
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
