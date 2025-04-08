
import React, { useState, useEffect } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { DealDialogContent } from "./dialogs/DealDialogContent";
import { DealSheetContent } from "./dialogs/DealSheetContent";
import { FormValues } from "@/components/deal-form/schema";
import { supabase } from "@/integrations/supabase/client";
import { useMediaQuery } from "@/hooks/useMediaQuery";

interface DealDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (values: FormValues) => Promise<boolean | void>;
  initialValues?: FormValues;
  isEditing?: boolean;
}

export const DealDialog: React.FC<DealDialogProps> = ({
  isOpen,
  onClose,
  onSubmit,
  initialValues,
  isEditing = false
}) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isBasicPlan, setIsBasicPlan] = useState(false);
  const isMobile = useMediaQuery("(max-width: 640px)");
  
  // Hämta salongs prenumerationsplan
  useEffect(() => {
    const checkSubscriptionPlan = async () => {
      try {
        let salonId: number | undefined;
        
        // Försök hämta salon_id från initialValues eller från autentiserad användare
        if (initialValues?.salon_id) {
          salonId = initialValues.salon_id;
        } else {
          const { data: { session } } = await supabase.auth.getSession();
          if (session?.user?.id) {
            const { data: salonData } = await supabase
              .from('salons')
              .select('id')
              .eq('user_id', session.user.id)
              .single();
              
            if (salonData?.id) {
              salonId = salonData.id;
            }
          }
        }
        
        if (salonId) {
          const { data } = await supabase
            .from('salons')
            .select('subscription_plan')
            .eq('id', salonId)
            .single();
          
          setIsBasicPlan(data?.subscription_plan === 'Baspaket');
        }
      } catch (error) {
        console.error("Error checking subscription plan:", error);
      }
    };
    
    if (isOpen) {
      checkSubscriptionPlan();
    }
  }, [isOpen, initialValues]);
  
  const handleSubmit = async (values: FormValues) => {
    try {
      console.log("DealDialog - Starting form submission");
      setIsSubmitting(true);
      
      // Kontrollera att vi inte har missat att sätta salon_id
      if (!values.salon_id) {
        try {
          const { data: { session } } = await supabase.auth.getSession();
          if (session?.user?.id) {
            const { data: salonData } = await supabase
              .from('salons')
              .select('id')
              .eq('user_id', session.user.id)
              .single();
              
            if (salonData?.id) {
              values.salon_id = salonData.id;
              console.log("DealDialog - Found and set salon_id:", salonData.id);
            }
          }
        } catch (error) {
          console.error("DealDialog - Error fetching salon ID:", error);
        }
      }
      
      console.log("DealDialog - Submitting with values:", values);
      
      // Call the parent onSubmit and wait for result
      const result = await onSubmit(values);
      
      console.log("DealDialog - Submission result:", result);
      
      // Only close dialog if submission was successful (result is not explicitly false)
      if (result !== false) {
        console.log("DealDialog - Submission successful, closing dialog");
        onClose();
      } else {
        console.log("DealDialog - Submission failed, keeping dialog open");
      }
    } catch (error) {
      console.error("DealDialog - Error during submission:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Använd Sheet för mobil och Dialog för desktop
  if (isMobile) {
    return (
      <Sheet open={isOpen} onOpenChange={(open) => {
        if (!open) onClose();
      }}>
        <SheetContent side="bottom" className="h-[90%] sm:max-w-md rounded-t-xl">
          <DealSheetContent
            isEditing={isEditing}
            initialValues={initialValues}
            isSubmitting={isSubmitting}
            isBasicPlan={isBasicPlan}
            onSubmit={handleSubmit}
            onClose={onClose}
          />
        </SheetContent>
      </Sheet>
    );
  }

  return (
    <Dialog open={isOpen} onOpenChange={(open) => {
      if (!open) onClose();
    }}>
      <DialogContent className="sm:max-w-md">
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
