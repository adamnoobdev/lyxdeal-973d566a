
import { useState, useEffect, useRef, MutableRefObject } from "react";
import { toast } from "sonner";
import { Salon } from "@/components/admin/types";

export interface UseEditSalonDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (values: any) => Promise<void>;
  initialValues?: any;
  isMountedRef?: MutableRefObject<boolean>;
}

export const useEditSalonDialog = ({
  isOpen,
  onClose,
  onSubmit,
  initialValues,
  isMountedRef: externalMountedRef
}: UseEditSalonDialogProps) => {
  const [isClosing, setIsClosing] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const [debugView, setDebugView] = useState(false);
  const initialRenderRef = useRef(true);
  const closeTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  
  // Create a form instance for direct manipulation
  const formRef = useRef<any>(null);
  
  // Use the provided ref or create our own
  const isMountedRef = externalMountedRef || useRef(true);

  useEffect(() => {
    if (initialValues) {
      console.log("useEditSalonDialog received initialValues:", initialValues);
      console.log("Subscription plan from initialValues:", initialValues.subscriptionPlan);
      console.log("Subscription type from initialValues:", initialValues.subscriptionType);
    }
  }, [initialValues]);

  useEffect(() => {
    setIsMounted(true);
    console.log("[useEditSalonDialog] Component mounted");
    
    return () => {
      console.log("[useEditSalonDialog] Component unmounting");
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
      console.log("[useEditSalonDialog] Dialog opening, resetting state");
      console.log("[useEditSalonDialog] Initial values:", initialValues);
      setIsClosing(false);
      setIsSubmitting(false);
    }
  }, [isOpen, isMounted, initialValues]);

  const handleClose = () => {
    if (isSubmitting || !isMounted) {
      console.log("[useEditSalonDialog] Cannot close: isSubmitting=", isSubmitting, "isMounted=", isMounted);
      return;
    }
    
    console.log("[useEditSalonDialog] Starting controlled close sequence");
    setIsClosing(true);
    
    if (closeTimeoutRef.current) {
      clearTimeout(closeTimeoutRef.current);
    }
    
    closeTimeoutRef.current = setTimeout(() => {
      if (isMountedRef.current) {
        console.log("[useEditSalonDialog] Executing close callback");
        onClose();
        
        closeTimeoutRef.current = setTimeout(() => {
          if (isMountedRef.current) {
            console.log("[useEditSalonDialog] Resetting closing state");
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
      console.log("[useEditSalonDialog] Submitting form with values:", values);
      
      if (values.fullAddress && !values.address) {
        values.address = values.fullAddress;
      }
      
      // Kontrollera och säkerställ prenumerationsplanen
      if (!values.subscriptionPlan) {
        console.log("[useEditSalonDialog] WARNING: Missing subscriptionPlan, using default");
        values.subscriptionPlan = "Baspaket";
      }
      
      if (!values.subscriptionType) {
        console.log("[useEditSalonDialog] WARNING: Missing subscriptionType, using default");
        values.subscriptionType = "monthly";
      }
      
      console.log("[useEditSalonDialog] Final subscription values:", {
        plan: values.subscriptionPlan,
        type: values.subscriptionType,
        skipSubscription: values.skipSubscription || false
      });
      
      await onSubmit(values);
      
      if (isMountedRef.current) {
        toast.success("Salonginformationen har uppdaterats");
        handleClose();
      }
    } catch (error) {
      console.error("[useEditSalonDialog] Error in form submission:", error);
      if (isMountedRef.current) {
        toast.error("Ett fel uppstod när salongen skulle uppdateras");
      }
    } finally {
      if (isMountedRef.current) {
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
        
        // Access the SalonForm's internal form through the ref
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

  return {
    isMounted,
    isClosing,
    isSubmitting,
    debugView,
    formRef,
    setDebugView,
    handleClose,
    handleSubmit,
    handleSubscriptionUpdated
  };
};
