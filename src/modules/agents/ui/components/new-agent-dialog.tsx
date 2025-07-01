import { ResponsiveDialog } from '@/components/responsive-dialog';
import AgentForm from './agent-form';

type NewAgentsDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export default function NewAgentsDialog({
  open,
  onOpenChange
}: NewAgentsDialogProps) {
  return (
    <ResponsiveDialog
      title='New Agent'
      description='Create a new agent'
      open={open}
      onOpenChange={onOpenChange}
    >
      <AgentForm
        onSuccess={() => onOpenChange(false)}
        onCancel={() => onOpenChange(false)}
      />
    </ResponsiveDialog>
  );
}
