
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
  const [salonId, setSalonId] = useState<number | null>(null);
  const isMobile = useMediaQuery("(max-width: 640px)");
  
  // Fetch salon info and subscription plan
  useEffect(() => {
    const fetchSalonInfo = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        
        if (!session?.user?.id) {
          console.error("[DealDialog] No active user session");
          toast.error("Du måste vara inloggad för att skapa erbjudanden");
          onClose();
          return;
        }
        
        console.log("[DealDialog] User ID:", session.user.id);
        
        // Get salon information
        const { data: salonData, error: salonError } = await supabase
          .from('salons')
          .select('id, name, subscription_plan, status')
          .eq('user_id', session.user.id)
          .single();
          
        if (salonError) {
          console.error("[DealDialog] Error fetching salon:", salonError);
          toast.error("Kunde inte hämta salonginformation");
          onClose();
          return;
        }
        
        if (!salonData) {
          console.error("[DealDialog] No salon found for user");
          toast.error("Ingen salong hittades för denna användare");
          onClose();
          return;
        }
        
        console.log("[DealDialog] Salon data:", salonData);
        setSalonId(salonData.id);
        
        // Check if subscription is active
        if (salonData.status !== 'active') {
          console.error("[DealDialog] Salon subscription not active");
          toast.error("Din prenumeration är inte aktiv. Vänligen aktivera din prenumeration för att skapa erbjudanden.");
          onClose();
          return;
        }
        
        // Set plan type
        const isPlanBasic = salonData.subscription_plan === 'Baspaket';
        setIsBasicPlan(isPlanBasic);
        console.log("[DealDialog] Is basic plan:", isPlanBasic);
      } catch (error) {
        console.error("[DealDialog] Error:", error);
        toast.error("Ett fel uppstod. Vänligen försök igen senare.");
        onClose();
      }
    };
    
    if (isOpen) {
      fetchSalonInfo();
    }
  }, [isOpen, onClose]);
  
  const handleSubmit = async (values: FormValues) => {
    if (isSubmitting) {
      console.log("[DealDialog] Submission already in progress, ignoring");
      return;
    }
    
    try {
      console.log("[DealDialog] Starting form submission");
      setIsSubmitting(true);
      
      // Set salon ID from state
      if (salonId) {
        values.salon_id = salonId;
        console.log("[DealDialog] Setting salon_id from state:", salonId);
      } else {
        console.error("[DealDialog] No salon ID available");
        toast.error("Kunde inte identifiera salongen");
        setIsSubmitting(false);
        return;
      }
      
      // Apply subscription-based restrictions
      if (isBasicPlan) {
        console.log("[DealDialog] Basic plan detected, forcing requires_discount_code=false");
        values.requires_discount_code = false;
      }
      
      // Validate that booking_url is provided for direct booking
      if (!values.requires_discount_code && !values.booking_url) {
        console.error("[DealDialog] Missing booking URL for direct booking");
        toast.error("En bokningslänk är obligatorisk när erbjudandet inte använder rabattkoder.");
        setIsSubmitting(false);
        return;
      }
      
      console.log("[DealDialog] Submitting with values:", values);
      
      // Call the parent onSubmit and wait for result
      const result = await onSubmit(values);
      
      console.log("[DealDialog] Submission result:", result);
      
      // Only close dialog if submission was successful
      if (result !== false) {
        console.log("[DealDialog] Submission successful, closing dialog");
        onClose();
      } else {
        console.log("[DealDialog] Submission failed, keeping dialog open");
        toast.error("Det gick inte att skapa erbjudandet. Försök igen senare.");
        setIsSubmitting(false);
      }
    } catch (error) {
      console.error("[DealDialog] Error during submission:", error);
      toast.error("Ett fel uppstod. Vänligen försök igen senare.");
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
