import { Fragment } from 'react';
import {
  MoreVerticalIcon,
  PencilIcon,
  ChevronRightIcon,
  TrashIcon
} from 'lucide-react';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbLink,
  BreadcrumbItem,
  BreadcrumbSeparator
} from '@/components/ui/breadcrumb';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';

type DetailViewHeaderProps = {
  root: {
    title: string;
    link: string;
  };
  paths: {
    title: string;
    link: string;
  }[];
  onEdit: () => void;
  onDelete: () => void;
};

export function DetailViewHeader({
  root,
  paths,
  onEdit,
  onDelete
}: DetailViewHeaderProps) {
  return (
    <div className='flex items-center justify-between'>
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink
              asChild
              className='text-muted-foreground text-xl font-medium'
            >
              <Link href={root.link} className='capitalize'>
                {root.title}
              </Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          {paths.map((path, index) => (
            <Fragment key={index}>
              <BreadcrumbSeparator
                className={cn(
                  index !== paths.length - 1
                    ? 'text-muted-foreground'
                    : 'text-foreground',
                  'text-xl font-medium [&>svg]:size-4'
                )}
              >
                <ChevronRightIcon />
              </BreadcrumbSeparator>
              <BreadcrumbItem>
                <BreadcrumbLink
                  asChild
                  className={cn(
                    index !== paths.length - 1
                      ? 'text-muted-foreground'
                      : 'text-foreground',
                    'text-xl font-medium'
                  )}
                >
                  <Link href={path.link} className='capitalize'>
                    {path.title}
                  </Link>
                </BreadcrumbLink>
              </BreadcrumbItem>
            </Fragment>
          ))}
        </BreadcrumbList>
      </Breadcrumb>
      <div className='flex items-center gap-2'>
        <DropdownMenu modal={false}>
          <DropdownMenuTrigger asChild>
            <Button variant='ghost'>
              <MoreVerticalIcon className='size-4' />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align='end'>
            <DropdownMenuItem onClick={onEdit} className='cursor-pointer'>
              <PencilIcon className='size-4' />
              Edit
            </DropdownMenuItem>
            <DropdownMenuItem onClick={onDelete} className='cursor-pointer'>
              <TrashIcon className='size-4' />
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}
