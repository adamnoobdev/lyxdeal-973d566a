
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { FormValues } from '@/components/deal-form/schema';
import { Sheet } from '@/components/ui/sheet';
import { useMediaQuery } from '@/hooks/useMediaQuery';
import { DealDialogContent } from './dialogs/DealDialogContent';
import { DealSheetContent } from './dialogs/DealSheetContent';

interface DealDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (values: FormValues) => Promise<void>;
  initialValues?: any;
}

export const DealDialog: React.FC<DealDialogProps> = ({
  isOpen,
  onClose,
  onSubmit,
  initialValues
}) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isBasicPlan, setIsBasicPlan] = useState(false);
  const isMobile = useMediaQuery("(max-width: 640px)");

  // Determine if editing an existing deal or creating a new one
  const isEditing = !!initialValues;

  // Fetch salon subscription plan information
  useEffect(() => {
    const fetchSalonData = async () => {
      try {
        const { supabase } = await import('@/integrations/supabase/client');
        const { data } = await supabase
          .from('salons')
          .select('subscription_plan')
          .eq('id', initialValues?.salon_id || -1)
          .single();
          
        setIsBasicPlan(data?.subscription_plan === 'Baspaket');
      } catch (error) {
        console.error("Error fetching salon data:", error);
        setIsBasicPlan(false);
      }
    };
    
    fetchSalonData();
  }, [initialValues?.salon_id]);

  // Handle form submission
  const handleSubmit = async (values: FormValues) => {
    if (isSubmitting) return;
    
    try {
      setIsSubmitting(true);
      await onSubmit(values);
      onClose();
    } catch (error) {
      console.error("Error submitting form:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Use Sheet component on mobile devices and Dialog on desktop
  return isMobile ? (
    <Sheet open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DealSheetContent
        isEditing={isEditing}
        initialValues={initialValues}
        isSubmitting={isSubmitting}
        isBasicPlan={isBasicPlan}
        onSubmit={handleSubmit}
        onClose={onClose}
      />
    </Sheet>
  ) : (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[600px]">
        <DealDialogContent
          isEditing={isEditing}
          initialValues={initialValues}
          isSubmitting={isSubmitting}
          isBasicPlan={isBasicPlan}
          onSubmit={handleSubmit}
          onClose={onClose}
        />
      </DialogContent>
    </Dialog>
  );
};
