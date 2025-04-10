
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription
} from "@/components/ui/dialog";
import { SalonForm } from "./SalonForm";
import { useState, useEffect, useRef } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { SubscriptionUpdateButton } from "./subscription/SubscriptionUpdateButton";
import { useForm } from "react-hook-form";

interface EditSalonDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (values: any) => Promise<void>;
  initialValues?: any;
}

export const EditSalonDialog = ({
  isOpen,
  onClose,
  onSubmit,
  initialValues,
}: EditSalonDialogProps) => {
  const [isClosing, setIsClosing] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const [debugView, setDebugView] = useState(false);
  const initialRenderRef = useRef(true);
  const closeTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  
  // Create a form instance for direct manipulation
  const formRef = useRef<any>(null);

  useEffect(() => {
    if (initialValues) {
      console.log("EditSalonDialog received initialValues:", initialValues);
      console.log("Subscription plan from initialValues:", initialValues.subscriptionPlan);
      console.log("Subscription type from initialValues:", initialValues.subscriptionType);
    }
  }, [initialValues]);

  useEffect(() => {
    setIsMounted(true);
    console.log("[EditSalonDialog] Component mounted");
    
    return () => {
      console.log("[EditSalonDialog] Component unmounting");
      setIsMounted(false);
      
      if (closeTimeoutRef.current) {
        clearTimeout(closeTimeoutRef.current);
      }
    };
  }, []);
  
  useEffect(() => {
    if (initialRenderRef.current) {
      initialRenderRef.current = false;
      return;
    }

    if (isOpen && isMounted) {
      console.log("[EditSalonDialog] Dialog opening, resetting state");
      console.log("[EditSalonDialog] Initial values:", initialValues);
      setIsClosing(false);
      setIsSubmitting(false);
    }
  }, [isOpen, isMounted, initialValues]);

  const handleClose = () => {
    if (isSubmitting || !isMounted) {
      console.log("[EditSalonDialog] Cannot close: isSubmitting=", isSubmitting, "isMounted=", isMounted);
      return;
    }
    
    console.log("[EditSalonDialog] Starting controlled close sequence");
    setIsClosing(true);
    
    if (closeTimeoutRef.current) {
      clearTimeout(closeTimeoutRef.current);
    }
    
    closeTimeoutRef.current = setTimeout(() => {
      if (isMounted) {
        console.log("[EditSalonDialog] Executing close callback");
        onClose();
        
        closeTimeoutRef.current = setTimeout(() => {
          if (isMounted) {
            console.log("[EditSalonDialog] Resetting closing state");
            setIsClosing(false);
          }
        }, 100);
      }
    }, 200);
  };

  const handleSubmit = async (values: any) => {
    if (isSubmitting || !isMounted) return;
    
    try {
      setIsSubmitting(true);
      console.log("[EditSalonDialog] Submitting form with values:", values);
      
      if (values.fullAddress && !values.address) {
        values.address = values.fullAddress;
      }
      
      if (!values.subscriptionPlan) {
        console.log("[EditSalonDialog] WARNING: Missing subscriptionPlan, using default");
        values.subscriptionPlan = "Baspaket";
      }
      
      if (!values.subscriptionType) {
        console.log("[EditSalonDialog] WARNING: Missing subscriptionType, using default");
        values.subscriptionType = "monthly";
      }
      
      console.log("[EditSalonDialog] Final subscription values:", {
        plan: values.subscriptionPlan,
        type: values.subscriptionType
      });
      
      await onSubmit(values);
      
      if (isMounted) {
        toast.success("Salonginformationen har uppdaterats");
        handleClose();
      }
    } catch (error) {
      console.error("[EditSalonDialog] Error in form submission:", error);
      if (isMounted) {
        toast.error("Ett fel uppstod när salongen skulle uppdateras");
      }
    } finally {
      if (isMounted) {
        setIsSubmitting(false);
      }
    }
  };

  const handleSubscriptionUpdated = async () => {
    try {
      const { supabase } = await import('@/integrations/supabase/client');
      const { data, error } = await supabase
        .from("salons")
        .select("subscription_plan, subscription_type")
        .eq("id", initialValues?.id)
        .single();
        
      if (error) {
        console.error("Error fetching updated salon data:", error);
        return;
      }
      
      if (data && formRef.current) {
        console.log("Updated subscription data from direct API:", data);
        
        // Access the SalonForm's internal form through the ref instead of directly
        if (formRef.current.setValue) {
          formRef.current.setValue("subscriptionPlan", data.subscription_plan || "Baspaket", { 
            shouldValidate: true,
            shouldDirty: true
          });
          
          formRef.current.setValue("subscriptionType", data.subscription_type || "monthly", { 
            shouldValidate: true, 
            shouldDirty: true
          });
          
          toast.success("Formuläret uppdaterat med nya värdena");
        }
      }
    } catch (error) {
      console.error("Error handling subscription update:", error);
    }
  };

  if (!isMounted) {
    console.log("[EditSalonDialog] Not rendering because component is not mounted");
    return null;
  }

  return (
    <Dialog 
      open={isOpen && !isClosing} 
      onOpenChange={(open) => {
        console.log("[EditSalonDialog] Dialog open state changed to:", open, "submitting:", isSubmitting);
        if (!open && !isSubmitting) handleClose();
      }}
    >
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto p-4 sm:p-6">
        <DialogHeader>
          <DialogTitle className="text-lg sm:text-xl">Redigera salong</DialogTitle>
          <DialogDescription className="text-xs sm:text-sm">
            Uppdatera information om salongen. Fyll i adressinformation för korrekt visning på kartan och hantera prenumerationsplan och godkännanden av villkor.
          </DialogDescription>
        </DialogHeader>
        
        {debugView && initialValues && (
          <div className="mb-4 p-3 bg-gray-100 rounded-md">
            <h3 className="font-medium mb-2">Debugging Information</h3>
            <pre className="text-xs overflow-auto max-h-40">
              {JSON.stringify({
                id: initialValues.id,
                subscriptionPlan: initialValues.subscriptionPlan,
                subscriptionType: initialValues.subscriptionType
              }, null, 2)}
            </pre>
            
            {initialValues.id && initialValues.subscriptionPlan && initialValues.subscriptionType && (
              <div className="mt-3">
                <SubscriptionUpdateButton 
                  salonId={initialValues.id} 
                  currentPlan={initialValues.subscriptionPlan}
                  currentType={initialValues.subscriptionType}
                  onSuccess={handleSubscriptionUpdated}
                />
                <p className="text-xs mt-2 text-gray-500">
                  Detta anropar API:et direkt för att uppdatera prenumerationen om det inte sparas korrekt.
                </p>
              </div>
            )}
            
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => setDebugView(false)}
              className="mt-2"
            >
              Dölj debugging
            </Button>
          </div>
        )}
        
        {!debugView && (
          <div className="mb-4">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => setDebugView(true)}
              className="text-xs"
            >
              Visa debugging
            </Button>
          </div>
        )}
        
        <SalonForm 
          onSubmit={handleSubmit} 
          initialValues={initialValues} 
          isEditing={true}
          isSubmitting={isSubmitting}
          ref={formRef}
        />
      </DialogContent>
    </Dialog>
  );
};
