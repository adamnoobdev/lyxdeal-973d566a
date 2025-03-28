
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { BasicInfoFields } from "./form/BasicInfoFields";
import { ContactFields } from "./form/ContactFields";
import { PasswordField } from "./form/PasswordField";
import { SubscriptionField } from "./form/SubscriptionField";
import { LoadingButton } from "@/components/ui/loading-button";

// Förbättrat schema med adressfält som stöder mapbox-integration
const formSchema = z.object({
  name: z.string().min(2, {
    message: "Namnet måste vara minst 2 tecken.",
  }),
  email: z.string().email({
    message: "Vänligen ange en giltig e-postadress.",
  }),
  phone: z.string().optional(),
  fullAddress: z.string().optional(),
  street: z.string().optional(),
  postalCode: z.string().optional(),
  city: z.string().optional(),
  address: z.string().optional(),
  password: z.string().optional(),
  skipSubscription: z.boolean().optional().default(false),
});

interface SalonFormProps {
  onSubmit: (values: z.infer<typeof formSchema>) => Promise<void>;
  initialValues?: z.infer<typeof formSchema>;
  isEditing?: boolean;
}

export const SalonForm = ({ onSubmit, initialValues, isEditing }: SalonFormProps) => {
  // Här använder vi de ursprungliga initialValues utan att behöva processa de manuellt
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: initialValues || {
      name: "",
      email: "",
      phone: "",
      fullAddress: "",
      street: "",
      postalCode: "",
      city: "",
      address: "",
      password: "",
      skipSubscription: false,
    },
  });

  const handleSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      // Vi behöver inte längre kombinera adressfälten manuellt - detta hanteras av MapboxAddressInput
      // som uppdaterar det dolda address-fältet som skickas till backend
      
      // Om adressen är tom, sätt den till undefined
      if (values.address?.trim() === "") {
        values.address = undefined;
      }
      
      await onSubmit(values);
    } catch (error) {
      console.error("Error submitting form:", error);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        <BasicInfoFields form={form} />
        <ContactFields form={form} />
        {isEditing && <PasswordField form={form} />}
        {!isEditing && <SubscriptionField form={form} />}
        
        <div className="flex justify-end gap-4">
          <LoadingButton 
            type="submit" 
            loading={form.formState.isSubmitting}
          >
            Spara
          </LoadingButton>
        </div>
      </form>
    </Form>
  );
};
