
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
  
  // Cleanup timers vid unmount
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
    const fetchSalonInfo = async () => {
      try {
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
        
        console.log("[DealDialog] Salon data:", salonData);
        setSalonId(salonData.id);
        
        // Check if subscription is active
        if (salonData.status !== 'active') {
          console.error("[DealDialog] Salon subscription not active");
          toast.error("Din prenumeration är inte aktiv. Vänligen aktivera din prenumeration för att skapa erbjudanden.");
          handleClose();
          return;
        }
        
        // Set plan type
        const isPlanBasic = salonData.subscription_plan === 'Baspaket';
        setIsBasicPlan(isPlanBasic);
        console.log("[DealDialog] Is basic plan:", isPlanBasic);
      } catch (error) {
        console.error("[DealDialog] Error fetching salon info:", error);
        toast.error("Ett fel uppstod vid hämtning av salonginformation");
        handleClose();
      }
    };
    
    if (isOpen) {
      fetchSalonInfo();
    }
  }, [isOpen]);
  
  // Kontrollerad stängningsfunktion för att undvika UI-frysning
  const handleClose = () => {
    if (isSubmitting || isClosing) {
      console.log("[DealDialog] Cannot close - operation in progress");
      return;
    }

    console.log("[DealDialog] Starting controlled close sequence");
    setIsClosing(true);
    
    // Rensa befintliga timers
    if (closeTimeoutRef.current) {
      clearTimeout(closeTimeoutRef.current);
    }
    
    // Stäng dialogrutan först
    closeTimeoutRef.current = setTimeout(() => {
      if (mountedRef.current) {
        onClose();
        
        // Återställ closing state efter en kort fördröjning
        closeTimeoutRef.current = setTimeout(() => {
          if (mountedRef.current) {
            setIsClosing(false);
          }
        }, 100);
      }
    }, 50);
  };
  
  // Hantera formulärinskickning
  const handleFormSubmit = async (values: FormValues) => {
    if (isSubmitting || isClosing) return;
    
    try {
      setIsSubmitting(true);
      
      // Lägga till salon_id om det saknas
      if (salonId && !values.salon_id) {
        values.salon_id = salonId;
      }
      
      // Om det är ett baspaket, se till att requires_discount_code alltid är false
      if (isBasicPlan) {
        values.requires_discount_code = false;
      }
      
      console.log("[DealDialog] Submitting form with values:", values);
      const result = await onSubmit(values);
      
      if (result !== false) {
        // Endast stäng dialog vid lyckad inskickning
        handleClose();
      }
    } catch (error) {
      console.error("[DealDialog] Error submitting form:", error);
      toast.error("Ett fel uppstod när erbjudandet skulle sparas");
    } finally {
      if (mountedRef.current) {
        setIsSubmitting(false);
      }
    }
  };

  // Rendera mobil eller desktop version
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
