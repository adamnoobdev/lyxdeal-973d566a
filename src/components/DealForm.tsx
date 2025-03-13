
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
import { createStripeProductForDeal } from "@/utils/stripeUtils";
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
  const [submitting, setSubmitting] = useState(false);
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
    },
  });

  const handleImageSelected = useCallback((imageUrl: string) => {
    form.setValue("imageUrl", imageUrl);
  }, [form]);

  const handleSubmit = useCallback(async (values: FormValues) => {
    // Förhindra dubbla formulärinskick med både state och ref
    if (submitting || isSubmittingRef.current) {
      console.log("Already submitting, preventing double submission");
      return;
    }
    
    try {
      setSubmitting(true);
      isSubmittingRef.current = true;
      
      if (!values.salon_id) {
        toast.error("Du måste välja en salong");
        setSubmitting(false);
        isSubmittingRef.current = false;
        return;
      }
      
      // Calculate days remaining
      const today = new Date();
      const daysRemaining = differenceInDays(values.expirationDate, today);
      const timeRemaining = `${daysRemaining} ${daysRemaining === 1 ? 'dag' : 'dagar'} kvar`;
      
      console.log('Submitting form with values:', values);

      // Asynkront anropa onSubmit och vänta på resultat
      await onSubmit(values);
      console.log("Form submission completed successfully");

      // Endast generera rabattkoder för nya erbjudanden, inte vid uppdatering
      if (!initialValues) {
        try {
          console.log("Fetching newly created deal ID");
          // Försök hämta det senaste erbjudandet från databasen
          const { data: newDeal, error } = await supabase
            .from('deals')
            .select('id')
            .eq('salon_id', values.salon_id)
            .order('created_at', { ascending: false })
            .limit(1)
            .single();

          if (error || !newDeal) {
            console.error("Error fetching new deal:", error);
            toast.error("Erbjudandet skapades, men rabattkoder kunde inte genereras.");
          } else {
            console.log("New deal found, ID:", newDeal.id);
            
            // Generera rabattkoder i en separat try-catch för att inte blockera resten av flödet
            try {
              const quantityNum = parseInt(values.quantity) || 10;
              const codesGenerated = await generateDiscountCodes(newDeal.id, quantityNum);
              
              // Skapa Stripe-produkt endast om det inte är ett gratis erbjudande och rabattkoder genererades
              if (!values.is_free && codesGenerated) {
                await createStripeProductForDeal(values);
                toast.success("Erbjudande och presentkoder har skapats");
              } else if (codesGenerated) {
                toast.success("Gratis erbjudande och presentkoder har skapats");
              } else {
                toast.success("Erbjudandet har skapats, men det uppstod ett problem med rabattkoderna");
              }
            } catch (codeError) {
              console.error("Error in rabattkod generation:", codeError);
              toast.success("Erbjudandet har skapats, men det uppstod ett problem med rabattkoderna");
            }
          }
        } catch (dealFetchError) {
          console.error("Exception in deal fetching:", dealFetchError);
          toast.success("Erbjudandet har skapats, men rabattkoder kunde inte genereras automatiskt");
        }
      } else {
        // För uppdateringar, visa endast framgångsmeddelande utan att generera koder
        toast.success("Erbjudandet har uppdaterats");
      }
    } catch (error) {
      console.error('Error in form submission:', error);
      toast.error("Något gick fel när erbjudandet skulle sparas.");
    } finally {
      // Återställ submitting-flaggor och form efter slutfört arbete
      setSubmitting(false);
      isSubmittingRef.current = false;
    }
  }, [initialValues, onSubmit, submitting]);

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4 max-h-[calc(85vh-8rem)] overflow-y-auto px-1">
        <div className="space-y-4">
          <SalonField form={form} />
          <FormFields 
            form={form} 
            handleImageSelected={handleImageSelected} 
            initialImageUrl={initialValues?.imageUrl}
          />
          <PriceFields form={form} />
          <LocationFields form={form} categories={CATEGORIES} cities={CITIES} />
          <QuantityField form={form} />
          <AdditionalFields form={form} />
        </div>

        <div className="sticky bottom-0 pt-4 bg-background">
          <Button 
            type="submit" 
            className="w-full" 
            disabled={isSubmitting || submitting}
          >
            {(isSubmitting || submitting) ? "Sparar..." : "Spara erbjudande"}
          </Button>
        </div>
      </form>
    </Form>
  );
};
