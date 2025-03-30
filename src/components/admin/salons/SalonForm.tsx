
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { BasicInfoFields } from "./form/BasicInfoFields";
import { ContactFields } from "./form/ContactFields";
import { PasswordField } from "./form/PasswordField";
import { SubscriptionField } from "./form/SubscriptionField";
import { TermsFields } from "./form/TermsFields";
import { useState } from "react";

const formSchema = z.object({
  name: z.string().min(1, { message: "Namn krävs" }),
  email: z.string().email({ message: "Ogiltig e-postadress" }),
  phone: z.string().optional(),
  street: z.string().optional(),
  postalCode: z.string().optional(),
  city: z.string().optional(),
  password: z.string().optional(),
  skipSubscription: z.boolean().optional().default(false),
  termsAccepted: z.boolean().optional().default(true),
  privacyAccepted: z.boolean().optional().default(true),
});

interface SalonFormProps {
  onSubmit: (values: any) => Promise<void>;
  initialValues?: any;
  isEditing?: boolean;
}

export const SalonForm = ({ onSubmit, initialValues, isEditing }: SalonFormProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Kombinera initialValues med standardvärden
  const defaultValues = {
    name: "",
    email: "",
    phone: "",
    street: "",
    postalCode: "",
    city: "",
    password: "",
    skipSubscription: false,
    termsAccepted: true,
    privacyAccepted: true,
    ...initialValues,
  };

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues,
  });

  const handleSubmit = async (values: any) => {
    setIsSubmitting(true);
    try {
      await onSubmit(values);
    } catch (error) {
      console.error("Form submission error:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-8">
        <BasicInfoFields form={form} />
        <ContactFields form={form} />
        
        {isEditing && <TermsFields form={form} />}
        
        {!isEditing && <PasswordField form={form} />}
        
        {!isEditing && <SubscriptionField form={form} />}

        <div className="flex justify-end">
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Sparar..." : isEditing ? "Uppdatera" : "Skapa"}
          </Button>
        </div>
      </form>
    </Form>
  );
};
