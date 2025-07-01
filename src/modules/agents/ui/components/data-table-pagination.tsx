import { Button } from '@/components/ui/button';

interface DataTablePaginationProps<TData> {
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export function DataTablePagination<TData>({
  page,
  totalPages,
  onPageChange
}: DataTablePaginationProps<TData>) {
  return (
    <div className='flex items-center justify-between px-2'>
      <div className='text-muted-foreground flex-1 text-sm'>
        {page} of {totalPages || 1}
      </div>
      <div className='flex items-center justify-end gap-x-2 py-4'>
        <Button
          variant='outline'
          size='sm'
          onClick={() => onPageChange(Math.max(1, page - 1))}
          disabled={page === 1}
        >
          <span className='sr-only'>Previous</span>
          Previous
        </Button>
        <Button
          variant='outline'
          size='sm'
          onClick={() => onPageChange(Math.min(totalPages, page + 1))}
          disabled={page === totalPages || totalPages === 0}
        >
          <span className='sr-only'>Next</span>
          Next
        </Button>
      </div>
    </div>
  );
}
