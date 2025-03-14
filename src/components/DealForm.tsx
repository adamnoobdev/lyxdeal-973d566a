import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { FormFields } from "./deal-form/FormFields";
import { PriceFields } from "./deal-form/PriceFields";
import { LocationFields } from "./deal-form/LocationFields";
import { SalonField } from "./deal-form/SalonField";
import { QuantityField } from "./deal-form/QuantityField";
import { AdditionalFields } from "./deal-form/AdditionalFields";
import { formSchema, FormValues } from "./deal-form/schema";
import { generateDiscountCodes } from "@/utils/discount-codes";
import { toast } from "sonner";
import { CATEGORIES, CITIES } from "@/constants/app-constants";
import { supabase } from "@/integrations/supabase/client";
import { useState, useCallback, useRef } from "react";
import { addDays, differenceInDays, endOfMonth } from "date-fns";

interface DealFormProps {
  onSubmit: (values: FormValues) => Promise<void>;
  isSubmitting?: boolean;
  initialValues?: FormValues;
}

export const DealForm = ({ onSubmit, isSubmitting = false, initialValues }: DealFormProps) => {
  const [internalSubmitting, setInternalSubmitting] = useState(false);
  const [isGeneratingCodes, setIsGeneratingCodes] = useState(false);
  const isSubmittingRef = useRef(false);
  
  const defaultExpirationDate = initialValues?.expirationDate || endOfMonth(new Date());
  
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: initialValues || {
      title: "",
      description: "",
      imageUrl: "",
      originalPrice: "",
      discountedPrice: "",
      category: "",
      city: "",
      expirationDate: defaultExpirationDate,
      featured: false,
      salon_id: undefined,
      quantity: "10",
      is_free: false,
      is_active: true,
    },
  });

  const handleImageSelected = useCallback((imageUrl: string) => {
    form.setValue("imageUrl", imageUrl);
  }, [form]);

  const handleSubmit = useCallback(async (values: FormValues) => {
    if (internalSubmitting || isSubmitting || isSubmittingRef.current) {
      console.log("[DealForm] Already submitting, preventing double submission");
      return;
    }
    
    try {
      setInternalSubmitting(true);
      isSubmittingRef.current = true;
      
      if (!values.salon_id) {
        toast.error("Du måste välja en salong");
        return;
      }
      
      const today = new Date();
      const daysRemaining = differenceInDays(values.expirationDate, today);
      const timeRemaining = `${daysRemaining} ${daysRemaining === 1 ? 'dag' : 'dagar'} kvar`;
      
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

            const { data: verificationData, error: verificationError } = await supabase
              .from('discount_codes')
              .select('code')
              .eq('deal_id', newDeal.id)
              .limit(5);

            if (verificationError) {
              console.error("[DealForm] ❌ Error verifying discount codes:", verificationError);
            } else if (!verificationData || verificationData.length === 0) {
              console.error("[DealForm] ❌ Verification failed: No codes found for deal", newDeal.id);
              toast.warning("Erbjudandet har skapats, men rabattkoderna kunde inte verifieras", {
                description: "Kontrollera databasen manuellt eller försök generera rabattkoder senare."
              });
            } else {
              console.log("[DealForm] ✓ Verified creation with sample codes:", 
                verificationData.map(c => c.code).join(', '));
            }
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
    } catch (error) {
      console.error('[DealForm] ❌ Error in form submission:', error);
      toast.error("Något gick fel när erbjudandet skulle sparas.", {
        description: error instanceof Error ? error.message : "Ett oväntat fel uppstod"
      });
    } finally {
      setTimeout(() => {
        setInternalSubmitting(false);
        isSubmittingRef.current = false;
      }, 500);
    }
  }, [initialValues, onSubmit, internalSubmitting, isSubmitting]);

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
        <div className="space-y-4">
          <SalonField form={form} />
          <FormFields 
            form={form} 
            handleImageSelected={handleImageSelected} 
            initialImageUrl={initialValues?.imageUrl}
          />
          <PriceFields form={form} />
          <LocationFields form={form} categories={CATEGORIES} cities={CITIES} />
          <QuantityField form={form} readOnly={!!initialValues} />
          <AdditionalFields form={form} />
        </div>

        <div className="pt-4 sticky bottom-0 bg-background">
          <Button 
            type="submit" 
            className="w-full" 
            disabled={isSubmitting || internalSubmitting || isGeneratingCodes}
          >
            {isGeneratingCodes 
              ? "Genererar rabattkoder..." 
              : (isSubmitting || internalSubmitting) 
                ? "Sparar..." 
                : "Spara erbjudande"}
          </Button>
        </div>
      </form>
    </Form>
  );
};
