import { MeetingGetOne } from '@/modules/meetings/types';
import MeetingForm from '@/modules/meetings/ui/components/meeting-form';
import { ResponsiveDialog } from '@/components/responsive-dialog';

type UpdateMeetingDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initialValues: MeetingGetOne;
};

export default function UpdateMeetingDialog({
  open,
  onOpenChange,
  initialValues
}: UpdateMeetingDialogProps) {
  return (
    <ResponsiveDialog
      title='Update Meeting'
      description='Update the meeting details'
      open={open}
      onOpenChange={onOpenChange}
    >
      <MeetingForm
        onSuccess={() => onOpenChange(false)}
        onCancel={() => onOpenChange(false)}
        initialValues={initialValues}
      />
    </ResponsiveDialog>
  );
}
