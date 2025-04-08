
import React, { useState, useEffect } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { DealDialogContent } from "./dialogs/DealDialogContent";
import { DealSheetContent } from "./dialogs/DealSheetContent";
import { FormValues } from "@/components/deal-form/schema";
import { supabase } from "@/integrations/supabase/client";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import { toast } from "sonner";

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
  
  // Fetch salon subscription plan
  useEffect(() => {
    const checkSubscriptionPlan = async () => {
      try {
        let salonId: number | undefined;
        
        // Try to get salon_id from initialValues or from authenticated user
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
          
          const isPlanBasic = data?.subscription_plan === 'Baspaket';
          console.log("[DealDialog] Subscription plan:", data?.subscription_plan, "isBasicPlan:", isPlanBasic);
          setIsBasicPlan(isPlanBasic);
        }
      } catch (error) {
        console.error("[DealDialog] Error checking subscription plan:", error);
      }
    };
    
    if (isOpen) {
      checkSubscriptionPlan();
    }
  }, [isOpen, initialValues]);
  
  const handleSubmit = async (values: FormValues) => {
    if (isSubmitting) {
      console.log("[DealDialog] Submission already in progress, ignoring");
      return;
    }
    
    try {
      console.log("[DealDialog] Starting form submission");
      setIsSubmitting(true);
      
      // Ensure salon_id is set
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
              console.log("[DealDialog] Found and set salon_id:", salonData.id);
            }
          }
        } catch (error) {
          console.error("[DealDialog] Error fetching salon ID:", error);
          toast.error("Kunde inte hitta salong-ID. Vänligen försök igen senare.");
          setIsSubmitting(false);
          return;
        }
      }
      
      if (!values.salon_id) {
        console.error("[DealDialog] No salon ID available");
        toast.error("Kunde inte hitta salong-ID. Försök logga ut och in igen.");
        setIsSubmitting(false);
        return;
      }
      
      // Apply subscription-based restrictions
      if (isBasicPlan) {
        console.log("[DealDialog] Basic plan detected, forcing requires_discount_code=false");
        values.requires_discount_code = false;
      }
      
      console.log("[DealDialog] Submitting with values:", values);
      
      // Call the parent onSubmit and wait for result
      const result = await onSubmit(values);
      
      console.log("[DealDialog] Submission result:", result);
      
      // Only close dialog if submission was successful (result is not explicitly false)
      if (result !== false) {
        console.log("[DealDialog] Submission successful, closing dialog");
        onClose();
      } else {
        console.log("[DealDialog] Submission failed, keeping dialog open");
        toast.error("Det gick inte att skapa erbjudandet. Kontrollera att alla fält är korrekt ifyllda.");
      }
    } catch (error) {
      console.error("[DealDialog] Error during submission:", error);
      toast.error("Ett fel uppstod. Vänligen försök igen senare.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Use Sheet for mobile and Dialog for desktop
  if (isMobile) {
    return (
      <Sheet open={isOpen} onOpenChange={(open) => {
        if (!open && !isSubmitting) onClose();
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
      if (!open && !isSubmitting) onClose();
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
