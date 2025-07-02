import { useState, useCallback, JSX, memo } from 'react';
import { Button } from '@/components/ui/button';
import { ResponsiveDialog } from '@/components/responsive-dialog';

interface ConfirmPromise {
  resolve: (value: boolean) => void;
}

interface ConfirmOptions {
  title: string;
  description: string;
  confirmText?: string;
  cancelText?: string;
}

interface UseConfirmReturn {
  ConfirmDialog: () => JSX.Element;
  confirm: () => Promise<boolean>;
}

export const useConfirm = (options: ConfirmOptions): UseConfirmReturn => {
  const {
    title,
    description,
    confirmText = 'Confirm',
    cancelText = 'Cancel'
  } = options;

  const [promise, setPromise] = useState<ConfirmPromise | null>(null);

  const confirm = useCallback((): Promise<boolean> => {
    return new Promise((resolve) => {
      setPromise({ resolve });
    });
  }, []);

  const handleClose = useCallback(() => {
    setPromise(null);
  }, []);

  const handleConfirm = useCallback(() => {
    if (promise) {
      promise.resolve(true);
      handleClose();
    }
  }, [promise, handleClose]);

  const handleCancel = useCallback(() => {
    if (promise) {
      promise.resolve(false);
      handleClose();
    }
  }, [promise, handleClose]);

  const ConfirmDialog = useCallback(
    (): JSX.Element => (
      <ResponsiveDialog
        open={promise !== null}
        onOpenChange={handleClose}
        title={title}
        description={description}
      >
        <div className='flex flex-col-reverse items-center justify-end gap-x-2 gap-y-2 pt-4 lg:flex-row'>
          <Button
            variant='outline'
            onClick={handleCancel}
            className='w-full lg:w-auto'
          >
            {cancelText}
          </Button>
          <Button onClick={handleConfirm} className='w-full lg:w-auto'>
            {confirmText}
          </Button>
        </div>
      </ResponsiveDialog>
    ),
    [
      promise,
      handleClose,
      handleCancel,
      handleConfirm,
      title,
      description,
      confirmText,
      cancelText
    ]
  );

  return { ConfirmDialog, confirm };
};
