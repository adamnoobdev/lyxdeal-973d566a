
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
import { useState, useEffect } from "react";

const formSchema = z.object({
  name: z.string().min(1, { message: "Namn krävs" }),
  email: z.string().email({ message: "Ogiltig e-postadress" }),
  phone: z.string().optional(),
  street: z.string().optional(),
  postalCode: z.string().optional(),
  city: z.string().optional(),
  address: z.string().optional(),
  password: z.string().optional(),
  skipSubscription: z.boolean().optional().default(false),
  subscriptionPlan: z.string().optional(),
  subscriptionType: z.string().optional(),
  termsAccepted: z.boolean().optional().default(true),
  privacyAccepted: z.boolean().optional().default(true),
});

interface SalonFormProps {
  onSubmit: (values: any) => Promise<void>;
  initialValues?: any;
  isEditing?: boolean;
  isSubmitting?: boolean;
}

export const SalonForm = ({ onSubmit, initialValues, isEditing, isSubmitting: externalIsSubmitting }: SalonFormProps) => {
  const [internalIsSubmitting, setInternalIsSubmitting] = useState(false);
  
  // Use external isSubmitting state if provided, otherwise use internal state
  const isSubmitting = externalIsSubmitting !== undefined ? externalIsSubmitting : internalIsSubmitting;

  // Kombinera initialValues med standardvärden
  const defaultValues = {
    name: "",
    email: "",
    phone: "",
    street: "",
    postalCode: "",
    city: "",
    address: "",
    password: "",
    skipSubscription: false,
    subscriptionPlan: "Baspaket",
    subscriptionType: "monthly",
    termsAccepted: true,
    privacyAccepted: true,
    ...initialValues,
  };

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues,
  });

  // Debug för att se vad vi har för värden i formuläret
  useEffect(() => {
    if (isEditing) {
      console.log("Form initialized with values:", form.getValues());
    }
  }, [form, isEditing]);

  const handleSubmit = async (values: any) => {
    if (isSubmitting) return;
    
    setInternalIsSubmitting(true);
    try {
      // Debugging för att se vilka värden som skickas till backend
      console.log("Form submitting with values:", values);
      await onSubmit(values);
    } catch (error) {
      console.error("Form submission error:", error);
    } finally {
      setInternalIsSubmitting(false);
    }
  };

  // Watch skipSubscription field to determine whether to show subscription fields
  const skipSubscription = form.watch("skipSubscription");

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        <div className="space-y-4">
          <BasicInfoFields form={form} />
        </div>
        
        <div className="space-y-4">
          <ContactFields 
            form={form} 
            includeSubscriptionFields={true} // Alltid visa prenumerationsfält
          />
        </div>
        
        {isEditing && (
          <div className="space-y-4">
            <TermsFields form={form} />
          </div>
        )}
        
        {!isEditing && (
          <div className="space-y-4">
            <PasswordField form={form} />
          </div>
        )}
        
        {!isEditing && (
          <div className="space-y-4">
            <SubscriptionField form={form} />
          </div>
        )}

        <div className="flex justify-end pt-2">
          <Button 
            type="submit" 
            disabled={isSubmitting}
            className="w-full sm:w-auto px-6"
          >
            {isSubmitting ? "Sparar..." : isEditing ? "Uppdatera" : "Skapa"}
          </Button>
        </div>
      </form>
    </Form>
  );
};
