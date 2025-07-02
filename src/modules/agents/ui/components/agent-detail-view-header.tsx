import { MoreVerticalIcon, PencilIcon, TrashIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';

type AgentDetailViewHeaderProps = {
  agentId: string;
  agentName: string;
  onEdit: () => void;
  onDelete: () => void;
};

export function AgentDetailViewHeader({
  agentId,
  agentName,
  onEdit,
  onDelete
}: AgentDetailViewHeaderProps) {
  return (
    <div className='flex items-center justify-between'>
      <h1 className='text-foreground text-xl font-medium'>{agentName}</h1>
      <div className='flex items-center gap-2'>
        <DropdownMenu modal={false}>
          <DropdownMenuTrigger asChild>
            <Button variant='ghost'>
              <MoreVerticalIcon className='size-4' />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align='end'>
            <DropdownMenuItem onClick={onEdit}>
              <PencilIcon className='size-4' />
              Edit
            </DropdownMenuItem>
            <DropdownMenuItem onClick={onDelete}>
              <TrashIcon className='size-4' />
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}
