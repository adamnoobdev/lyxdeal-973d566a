
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
import { useState, useEffect } from "react";
import { addDays, differenceInDays, endOfMonth } from "date-fns";

interface DealFormProps {
  onSubmit: (values: FormValues) => Promise<void>;
  isSubmitting?: boolean;
  initialValues?: FormValues;
}

export const DealForm = ({ onSubmit, isSubmitting = false, initialValues }: DealFormProps) => {
  const [submitting, setSubmitting] = useState(false);
  const [isUnmounting, setIsUnmounting] = useState(false);
  
  // Clear state when component unmounts
  useEffect(() => {
    return () => {
      setIsUnmounting(true);
    };
  }, []);
  
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

  const handleImageSelected = (imageUrl: string) => {
    form.setValue("imageUrl", imageUrl);
  };

  const handleSubmit = async (values: FormValues) => {
    if (submitting || isUnmounting) return;
    
    try {
      setSubmitting(true);
      
      if (!values.salon_id) {
        toast.error("Du måste välja en salong");
        setSubmitting(false);
        return;
      }
      
      // Calculate days remaining
      const today = new Date();
      const daysRemaining = differenceInDays(values.expirationDate, today);
      const timeRemaining = `${daysRemaining} ${daysRemaining === 1 ? 'dag' : 'dagar'} kvar`;
      
      // Log form values before submitting
      console.log('Submitting form with values:', values);

      // Pass values directly to onSubmit
      await onSubmit(values);

      // Only proceed with additional steps if this is a new deal
      if (!initialValues && !isUnmounting) {
        try {
          // Get the newly created deal's ID
          const { data: newDeal } = await supabase
            .from('deals')
            .select('id')
            .eq('salon_id', values.salon_id)
            .order('created_at', { ascending: false })
            .limit(1)
            .single();

          if (newDeal && !isUnmounting) {
            // Generate discount codes based on the quantity specified
            await generateDiscountCodes(newDeal.id, parseInt(values.quantity));
            
            // Only create Stripe product if not free
            if (!values.is_free && !isUnmounting) {
              await createStripeProductForDeal(values);
              toast.success("Erbjudande och presentkoder har skapats");
            } else if (!isUnmounting) {
              toast.success("Gratis erbjudande och presentkoder har skapats");
            }
          }
        } catch (error) {
          console.error('Error in post-submission process:', error);
          if (!isUnmounting) {
            toast.error("Erbjudandet sparades men det uppstod problem med att skapa presentkoder");
          }
        }
      }
    } catch (error) {
      console.error('Error:', error);
      if (!isUnmounting) {
        toast.error("Något gick fel när erbjudandet skulle sparas.");
      }
    } finally {
      if (!isUnmounting) {
        setTimeout(() => {
          setSubmitting(false);
        }, 300);
      }
    }
  };

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
          <Button type="submit" className="w-full" disabled={isSubmitting || submitting}>
            {(isSubmitting || submitting) ? "Sparar..." : "Spara erbjudande"}
          </Button>
        </div>
      </form>
    </Form>
  );
};
