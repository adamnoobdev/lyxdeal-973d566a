
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
import { generateDiscountCodes } from "@/utils/discountCodeUtils";
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
  
  // Set default expiration date to end of current month if not provided
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
      quantity: "10", // Default value for quantity
      is_free: false, // Default value for is_free
      is_active: true, // Default value for is_active
    },
  });

  const handleImageSelected = useCallback((imageUrl: string) => {
    form.setValue("imageUrl", imageUrl);
  }, [form]);

  const handleSubmit = useCallback(async (values: FormValues) => {
    // Prevent double form submissions using both state and ref
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
      
      // Calculate days remaining
      const today = new Date();
      const daysRemaining = differenceInDays(values.expirationDate, today);
      const timeRemaining = `${daysRemaining} ${daysRemaining === 1 ? 'dag' : 'dagar'} kvar`;
      
      console.log('[DealForm] 🟢 Submitting form with values:', values);

      // Call the provided onSubmit handler
      await onSubmit(values);
      console.log("[DealForm] ✓ Form submission completed successfully");

      // Only generate discount codes for new deals, not when updating
      if (!initialValues) {
        try {
          console.log("[DealForm] 🟢 New deal created, preparing to generate discount codes");
          setIsGeneratingCodes(true);
          
          // Wait longer to ensure the database transaction is complete
          console.log("[DealForm] Waiting for database to complete deal creation...");
          await new Promise(resolve => setTimeout(resolve, 3000));
          
          // Try to fetch the latest deal from the database
          console.log("[DealForm] Fetching newly created deal ID");
          const { data: newDeal, error } = await supabase
            .from('deals')
            .select('id, title')
            .eq('salon_id', values.salon_id)
            .order('created_at', { ascending: false })
            .limit(1)
            .single();

          if (error || !newDeal) {
            console.error("[DealForm] ❌ Error fetching new deal:", error);
            toast.error("Erbjudandet skapades, men rabattkoder kunde inte genereras.", {
              description: "Ett fel uppstod när det senaste erbjudandet skulle hämtas. Försök generera rabattkoder manuellt."
            });
          } else {
            console.log("[DealForm] ✓ New deal found, ID:", newDeal.id, "Title:", newDeal.title);
            
            // Generate discount codes in a separate try-catch to not block the rest of the flow
            try {
              const quantityNum = parseInt(values.quantity) || 10;
              console.log(`[DealForm] 🟢 Starting generation of ${quantityNum} discount codes for deal ${newDeal.id}`);
              
              const codesGenerated = await generateDiscountCodes(newDeal.id, quantityNum);
              
              if (codesGenerated) {
                console.log(`[DealForm] ✓ Successfully generated ${quantityNum} discount codes for deal ${newDeal.id}`);
                toast.success(`Erbjudande och ${quantityNum} rabattkoder har skapats`);
              } else {
                console.warn(`[DealForm] ⚠️ Failed to generate discount codes for deal ${newDeal.id}`);
                toast.warning("Erbjudandet har skapats, men det uppstod ett problem med rabattkoderna", {
                  description: "Det kan ta en stund innan koderna dyker upp i systemet. Du kan försöka visa rabattkoderna för erbjudandet om en liten stund."
                });
              }
            } catch (codeError) {
              console.error("[DealForm] ❌ Error in discount code generation:", codeError);
              toast.error("Erbjudandet har skapats, men det uppstod ett fel med rabattkoderna", {
                description: "Ett tekniskt problem inträffade. Vänligen kontakta support om problemet kvarstår."
              });
            }
          }
        } catch (dealFetchError) {
          console.error("[DealForm] ❌ Exception in deal fetching:", dealFetchError);
          toast.error("Erbjudandet har skapats, men rabattkoder kunde inte genereras automatiskt", {
            description: "Ett fel uppstod när det senaste erbjudandet skulle hämtas. Försök generera rabattkoder manuellt."
          });
        } finally {
          setIsGeneratingCodes(false);
        }
      } else {
        // For updates, just show success message without generating codes
        toast.success("Erbjudandet har uppdaterats");
      }
    } catch (error) {
      console.error('[DealForm] ❌ Error in form submission:', error);
      toast.error("Något gick fel när erbjudandet skulle sparas.", {
        description: error instanceof Error ? error.message : "Ett oväntat fel uppstod"
      });
    } finally {
      // Reset submitting flags after completion
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
