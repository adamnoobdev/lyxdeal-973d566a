
import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
} from "@/components/ui/dialog";
import {
  Sheet,
  SheetContent,
} from "@/components/ui/sheet";
import { FormValues } from '@/components/deal-form/schema';
import { useSubscriptionData } from './subscription/useSubscriptionData';
import { useResponsiveDialog } from './dialogs/useResponsiveDialog';
import { DealDialogContent } from './dialogs/DealDialogContent';
import { DealSheetContent } from './dialogs/DealSheetContent';

interface DealDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (values: FormValues) => Promise<void>;
  initialValues?: Partial<FormValues>;
}

export const DealDialog: React.FC<DealDialogProps> = ({
  isOpen,
  onClose,
  onSubmit,
  initialValues = {}
}) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { subscriptionInfo } = useSubscriptionData();
  const { isMobile, isClosing, setIsClosing } = useResponsiveDialog();
  
  const isBasicPlan = subscriptionInfo?.plan_title === 'Baspaket';
  const isEditing = initialValues && Object.keys(initialValues).length > 0;
  
  // Controlled close to prevent state update issues
  const handleClose = () => {
    if (isSubmitting) return;
    
    setIsClosing(true);
    setTimeout(() => {
      onClose();
      setIsClosing(false);
    }, 200);
  };

  const handleSubmit = async (data: FormValues) => {
    try {
      setIsSubmitting(true);
      await onSubmit(data);
      handleClose();
    } finally {
      setIsSubmitting(false);
    }
  };

  // Use Sheet for mobile, Dialog for desktop
  if (isMobile) {
    return (
      <Sheet 
        open={isOpen && !isClosing} 
        onOpenChange={(open) => !open && handleClose()}
      >
        <SheetContent className="h-[90vh] overflow-y-auto pt-6 px-4" side="bottom">
          <DealSheetContent 
            isEditing={isEditing}
            initialValues={initialValues}
            isSubmitting={isSubmitting}
            isBasicPlan={isBasicPlan}
            onSubmit={handleSubmit}
            onClose={handleClose}
          />
        </SheetContent>
      </Sheet>
    );
  }

  return (
    <Dialog 
      open={isOpen && !isClosing} 
      onOpenChange={(open) => !open && handleClose()}
    >
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DealDialogContent 
          isEditing={isEditing}
          initialValues={initialValues}
          isSubmitting={isSubmitting}
          isBasicPlan={isBasicPlan}
          onSubmit={handleSubmit}
          onClose={handleClose}
        />
      </DialogContent>
    </Dialog>
  );
};
