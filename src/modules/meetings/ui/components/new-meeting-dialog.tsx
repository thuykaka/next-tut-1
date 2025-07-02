import { useRouter } from 'next/navigation';
import MeetingForm from '@/modules/meetings/ui/components/meeting-form';
import { ResponsiveDialog } from '@/components/responsive-dialog';

type NewMeetingDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export default function NewMeetingDialog({
  open,
  onOpenChange
}: NewMeetingDialogProps) {
  const router = useRouter();

  return (
    <ResponsiveDialog
      title='New Meeting'
      description='Create a new meeting'
      open={open}
      onOpenChange={onOpenChange}
    >
      <MeetingForm
        onSuccess={(id) => {
          onOpenChange(false);
          !id && router.push(`/meetings/${id}`);
        }}
        onCancel={() => onOpenChange(false)}
      />
    </ResponsiveDialog>
  );
}
