
import React, { useState, useEffect, useRef } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { DealDialogContent } from "./dialogs/DealDialogContent";
import { DealSheetContent } from "./dialogs/DealSheetContent";
import { FormValues } from "@/components/deal-form/schema";
import { supabase } from '@/integrations/supabase/client';
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
  const [isClosing, setIsClosing] = useState(false);
  const isMobile = useMediaQuery("(max-width: 640px)");
  const mountedRef = useRef(true);
  const closeTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  
  // Cleanup timers when unmounting
  useEffect(() => {
    mountedRef.current = true;
    
    return () => {
      mountedRef.current = false;
      if (closeTimeoutRef.current) {
        clearTimeout(closeTimeoutRef.current);
      }
    };
  }, []);
  
  // Fetch salon info and subscription plan
  useEffect(() => {
    let isMounted = true;
    
    const fetchSalonInfo = async () => {
      try {
        if (!isMounted) return;
        
        const { data: { session } } = await supabase.auth.getSession();
        
        if (!session?.user?.id) {
          console.error("[DealDialog] No active user session");
          toast.error("Du måste vara inloggad för att skapa erbjudanden");
          handleClose();
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
          handleClose();
          return;
        }
        
        if (!salonData) {
          console.error("[DealDialog] No salon found for user");
          toast.error("Ingen salong hittades för denna användare");
          handleClose();
          return;
        }
        
        if (!isMounted) return;
        
        console.log("[DealDialog] Salon data:", salonData);
        setSalonId(salonData.id);
        
        // Check if subscription is active
        if (salonData.status !== 'active') {
          console.error("[DealDialog] Salon subscription not active");
          toast.error("Din prenumeration är inte aktiv. Vänligen aktivera din prenumeration för att skapa erbjudanden.");
          handleClose();
          return;
        }
        
        // Check subscription plan regardless of how the salon was created
        const isPlanBasic = salonData.subscription_plan === 'Baspaket';
        if (isMounted) {
          setIsBasicPlan(isPlanBasic);
          console.log("[DealDialog] Is basic plan:", isPlanBasic);
        }
      } catch (error) {
        console.error("[DealDialog] Error fetching salon info:", error);
        toast.error("Ett fel uppstod vid hämtning av salonginformation");
        handleClose();
      }
    };
    
    if (isOpen) {
      fetchSalonInfo();
    }
    
    return () => {
      isMounted = false;
    };
  }, [isOpen]);
  
  // Improved controlled closing function to prevent UI freezing
  const handleClose = () => {
    if (isSubmitting || isClosing) {
      console.log("[DealDialog] Cannot close - operation in progress");
      return;
    }

    console.log("[DealDialog] Starting controlled close sequence");
    setIsClosing(true);
    
    // Clear any existing timers
    if (closeTimeoutRef.current) {
      clearTimeout(closeTimeoutRef.current);
    }
    
    // Use a more robust approach to closing
    closeTimeoutRef.current = setTimeout(() => {
      if (!mountedRef.current) return;
      
      // Actually close the dialog
      console.log("[DealDialog] Executing onClose callback");
      onClose();
      
      // Reset closing state after dialog is fully closed
      closeTimeoutRef.current = setTimeout(() => {
        if (mountedRef.current) {
          setIsClosing(false);
          console.log("[DealDialog] Reset closing state");
        }
      }, 300);
    }, 100);
  };
  
  // Handle form submission with improved checks
  const handleFormSubmit = async (values: FormValues) => {
    if (isSubmitting || isClosing) return;
    
    try {
      setIsSubmitting(true);
      
      // Add salon_id if missing
      if (salonId && !values.salon_id) {
        values.salon_id = salonId;
      }
      
      // CRITICAL: Force direct booking for basic plan salons
      // This must happen here as the final check before submission
      if (isBasicPlan) {
        console.log("[DealDialog] Enforcing direct booking for basic plan");
        values.requires_discount_code = false;
      }
      
      // Check if basic plan is trying to use discount codes (should never happen but just in case)
      if (isBasicPlan && values.requires_discount_code === true) {
        console.error("[DealDialog] Attempted to submit basic plan with discount codes enabled");
        toast.error("Med Baspaket kan du inte använda rabattkoder. Uppgradera till Premium för tillgång.");
        setIsSubmitting(false);
        return;
      }
      
      console.log("[DealDialog] Submitting form with values:", values);
      const result = await onSubmit(values);
      
      // Only close dialog on successful submission
      if (result !== false) {
        // Use the improved closing sequence
        handleClose();
      } else {
        setIsSubmitting(false);
      }
    } catch (error) {
      console.error("[DealDialog] Error submitting form:", error);
      toast.error("Ett fel uppstod när erbjudandet skulle sparas");
      if (mountedRef.current) {
        setIsSubmitting(false);
      }
    }
  };

  // Render mobile or desktop version
  if (isMobile) {
    return (
      <Sheet 
        open={isOpen && !isClosing}
        onOpenChange={(open) => {
          if (!open) handleClose();
        }}
      >
        <SheetContent side="bottom" className="h-[90vh] p-4 overflow-auto flex flex-col bg-background">
          <DealSheetContent
            isEditing={isEditing}
            initialValues={initialValues}
            isSubmitting={isSubmitting}
            isBasicPlan={isBasicPlan}
            onSubmit={handleFormSubmit}
            onClose={handleClose}
          />
        </SheetContent>
      </Sheet>
    );
  }

  return (
    <Dialog 
      open={isOpen && !isClosing}
      onOpenChange={(open) => {
        if (!open) handleClose();
      }}
    >
      <DialogContent className="w-[95vw] max-w-2xl h-[90vh] p-4 md:p-6 overflow-hidden flex flex-col bg-background">
        <DealDialogContent
          isEditing={isEditing}
          initialValues={initialValues}
          isSubmitting={isSubmitting}
          isBasicPlan={isBasicPlan}
          onSubmit={handleFormSubmit}
          onClose={handleClose}
        />
      </DialogContent>
    </Dialog>
  );
};
