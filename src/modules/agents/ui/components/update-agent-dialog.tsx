import { AgentGetOne } from '@/modules/agents/types';
import AgentForm from '@/modules/agents/ui/components/agent-form';
import { ResponsiveDialog } from '@/components/responsive-dialog';

type UpdateAgentDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initialValues: AgentGetOne;
};

export default function UpdateAgentDialog({
  open,
  onOpenChange,
  initialValues
}: UpdateAgentDialogProps) {
  return (
    <ResponsiveDialog
      title='Update Agent'
      description='Update the agent details'
      open={open}
      onOpenChange={onOpenChange}
    >
      <AgentForm
        onSuccess={() => onOpenChange(false)}
        onCancel={() => onOpenChange(false)}
        initialValues={initialValues}
      />
    </ResponsiveDialog>
  );
}
