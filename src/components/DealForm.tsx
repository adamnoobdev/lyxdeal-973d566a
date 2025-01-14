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

interface DealFormProps {
  onSubmit: (values: FormValues) => Promise<void>;
  isSubmitting?: boolean;
  initialValues?: FormValues;
}

export const DealForm = ({ onSubmit, isSubmitting = false, initialValues }: DealFormProps) => {
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
      timeRemaining: "",
      featured: false,
      salon_id: undefined,
      quantity: "10", // Default value for quantity
    },
  });

  const handleImageSelected = (imageUrl: string) => {
    form.setValue("imageUrl", imageUrl);
  };

  const handleSubmit = async (values: FormValues) => {
    try {
      if (!values.salon_id) {
        toast.error("Du måste välja en salong");
        return;
      }

      // First create the deal
      await onSubmit(values);

      // Only proceed with additional steps if this is a new deal
      if (!initialValues) {
        // Get the newly created deal's ID
        const { data: newDeal } = await supabase
          .from('deals')
          .select('id')
          .eq('salon_id', values.salon_id)
          .order('created_at', { ascending: false })
          .limit(1)
          .single();

        if (newDeal) {
          // Generate discount codes based on the quantity specified
          await generateDiscountCodes(newDeal.id, parseInt(values.quantity));
          // Create Stripe product
          await createStripeProductForDeal(values);
          toast.success("Erbjudande och presentkoder har skapats");
        }
      }
    } catch (error) {
      console.error('Error:', error);
      toast.error("Något gick fel när erbjudandet skulle sparas.");
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        <SalonField form={form} />
        <FormFields form={form} handleImageSelected={handleImageSelected} />
        <PriceFields form={form} />
        <LocationFields form={form} categories={CATEGORIES} cities={CITIES} />
        <QuantityField form={form} />
        <AdditionalFields form={form} />

        <Button type="submit" className="w-full" disabled={isSubmitting}>
          {isSubmitting ? "Sparar..." : "Spara erbjudande"}
        </Button>
      </form>
    </Form>
  );
};