
import { useCallback, useRef, useState } from "react";
import { FormValues } from "./schema";
import { toast } from "sonner";
import { differenceInDays } from "date-fns";
import { supabase } from "@/integrations/supabase/client";
import { generateDiscountCodes } from "@/utils/discount-codes";
import { useDealFormContext } from "./DealFormContext";

export const useFormSubmission = (onSubmit: (values: FormValues) => Promise<void>, externalIsSubmitting?: boolean) => {
  const [internalSubmitting, setInternalSubmitting] = useState(false);
  const isSubmittingRef = useRef(false);
  const { 
    isSubmitting: contextIsSubmitting, 
    setIsSubmitting, 
    isGeneratingCodes, 
    setIsGeneratingCodes,
    initialValues
  } = useDealFormContext();

  const handleSubmit = useCallback(async (values: FormValues) => {
    // Check all submitting states to prevent multiple submissions
    if (internalSubmitting || contextIsSubmitting || externalIsSubmitting || isSubmittingRef.current || isGeneratingCodes) {
      console.log("[DealForm] Already submitting, preventing double submission");
      return;
    }
    
    try {
      console.log("[DealForm] Starting form submission");
      setInternalSubmitting(true);
      setIsSubmitting(true);
      isSubmittingRef.current = true;
      
      if (!values.salon_id) {
        toast.error("Du måste välja en salong");
        return;
      }
      
      console.log('[DealForm] 🟢 Submitting form with values:', values);

      await onSubmit(values);
      console.log("[DealForm] ✓ Form submission completed successfully");

      if (!initialValues) {
        try {
          console.log("[DealForm] 🟢 New deal created, generating discount codes");
          setIsGeneratingCodes(true);
          
          console.log("[DealForm] Waiting for database to complete deal creation...");
          await new Promise(resolve => setTimeout(resolve, 2000));
          
          console.log("[DealForm] Fetching newly created deal ID");
          const { data: newDeals, error: fetchError } = await supabase
            .from('deals')
            .select('id, title')
            .eq('salon_id', values.salon_id)
            .order('created_at', { ascending: false })
            .limit(1);

          if (fetchError || !newDeals || newDeals.length === 0) {
            console.error("[DealForm] ❌ Error fetching new deal:", fetchError);
            toast.error("Erbjudandet skapades, men kunde inte hitta det för att generera rabattkoder.", {
              description: "Försök generera rabattkoder manuellt senare."
            });
            return;
          }
          
          const newDeal = newDeals[0];
          console.log("[DealForm] ✓ New deal found, ID:", newDeal.id, "Title:", newDeal.title);
          
          const quantityNum = parseInt(values.quantity) || 10;
          console.log(`[DealForm] 🟢 Generating ${quantityNum} discount codes for deal ${newDeal.id}`);
          
          const success = await generateDiscountCodes(newDeal.id, quantityNum);
          
          if (success) {
            console.log(`[DealForm] ✓ Successfully generated ${quantityNum} rabattkoder for deal ${newDeal.id}`);
            toast.success(`Erbjudande och ${quantityNum} rabattkoder har skapats`);
          } else {
            console.warn(`[DealForm] ⚠️ Failed to generate discount codes for deal ${newDeal.id}`);
            toast.warning("Erbjudandet har skapats, men det uppstod ett problem med rabattkoderna", {
              description: "Försök generera rabattkoder manuellt senare."
            });
          }
        } catch (codeError) {
          console.error("[DealForm] ❌ Error in discount code generation:", codeError);
          toast.error("Erbjudandet har skapats, men det uppstod ett fel med rabattkoderna", {
            description: codeError instanceof Error ? codeError.message : "Ett oväntat fel uppstod"
          });
        } finally {
          setIsGeneratingCodes(false);
        }
      } else {
        toast.success("Erbjudandet har uppdaterats");
      }
    } catch (submitError) {
      console.error('[DealForm] ❌ Error in form submission:', submitError);
      toast.error("Något gick fel när erbjudandet skulle sparas.", {
        description: submitError instanceof Error ? submitError.message : "Ett oväntat fel uppstod"
      });
    } finally {
      setTimeout(() => {
        setInternalSubmitting(false);
        setIsSubmitting(false);
        isSubmittingRef.current = false;
      }, 500);
    }
  }, [
    initialValues, 
    onSubmit, 
    internalSubmitting, 
    contextIsSubmitting, 
    externalIsSubmitting, 
    isGeneratingCodes, 
    setIsGeneratingCodes, 
    setIsSubmitting
  ]);

  return { handleSubmit };
};
