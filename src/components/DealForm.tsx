
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form } from "@/components/ui/form";
import { FormFields } from "./deal-form/FormFields";
import { PriceFields } from "./deal-form/PriceFields";
import { LocationFields } from "./deal-form/LocationFields";
import { SalonField } from "./deal-form/SalonField";
import { QuantityField } from "./deal-form/QuantityField";
import { AdditionalFields } from "./deal-form/AdditionalFields";
import { BookingUrlField } from "./deal-form/BookingUrlField";
import { formSchema, FormValues } from "./deal-form/schema";
import { useCallback } from "react";
import { endOfMonth } from "date-fns";
import { useFormSubmission } from "./deal-form/useFormSubmission";
import { DealFormSubmitButton } from "./deal-form/DealFormSubmitButton";

interface DealFormProps {
  onSubmit: (values: FormValues) => Promise<void>;
  isSubmitting?: boolean;
  initialValues?: FormValues;
}

export const DealForm = ({ onSubmit, isSubmitting = false, initialValues }: DealFormProps) => {
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
      booking_url: "",
    },
  });

  const handleImageSelected = useCallback((imageUrl: string) => {
    form.setValue("imageUrl", imageUrl);
  }, [form]);

  // Create a handler that passes form values to parent onSubmit
  const handleFormSubmit = useFormSubmission(onSubmit, isSubmitting).handleSubmit;

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleFormSubmit)} className="space-y-4">
        <div className="space-y-4">
          <SalonField form={form} />
          <FormFields 
            form={form} 
            handleImageSelected={handleImageSelected} 
            initialImageUrl={initialValues?.imageUrl}
          />
          <PriceFields form={form} />
          <LocationFields form={form} categories={["Hårvård", "Nagelvård", "Ansiktsbehandling", "Massage", "Makeup", "Ögonfransar & Bryn", "Kroppsvård", "Fotvård", "Hudvård", "Annat"]} 
                         cities={["Stockholm", "Göteborg", "Malmö", "Uppsala", "Västerås", "Örebro", "Linköping", "Helsingborg", "Jönköping", "Norrköping"]} />
          <BookingUrlField form={form} />
          <QuantityField form={form} readOnly={!!initialValues} />
          <AdditionalFields form={form} />
        </div>

        <DealFormSubmitButton />
      </form>
    </Form>
  );
};
