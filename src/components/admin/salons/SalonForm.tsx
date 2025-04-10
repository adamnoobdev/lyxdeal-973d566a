
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
  // Always require subscription fields
  subscriptionPlan: z.string().min(1, { message: "Prenumerationsplan krävs" }),
  subscriptionType: z.string().min(1, { message: "Betalningsintervall krävs" }),
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
  const [formState, setFormState] = useState({
    isDirty: false,
    dirtyFields: {} as Record<string, boolean>
  });
  
  // Use external isSubmitting state if provided, otherwise use internal state
  const isSubmitting = externalIsSubmitting !== undefined ? externalIsSubmitting : internalIsSubmitting;

  // Combine initialValues with default values
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

  // Debug to see values in the form
  useEffect(() => {
    console.log("SalonForm initialized with values:", form.getValues());
    console.log("Subscription values:", {
      plan: form.getValues("subscriptionPlan"),
      type: form.getValues("subscriptionType")
    });
    
    // Monitor dirty state
    const subscription = form.watch(() => {
      const values = form.getValues();
      const dirtyFields = form.formState.dirtyFields;
      
      console.log("Form changed:", { 
        isDirty: form.formState.isDirty,
        dirtyFields: Object.keys(dirtyFields).filter(key => dirtyFields[key as keyof typeof dirtyFields])
      });
      
      setFormState({
        isDirty: form.formState.isDirty,
        dirtyFields: form.formState.dirtyFields as Record<string, boolean>
      });
    });
    
    return () => subscription.unsubscribe();
  }, [form]);

  const handleSubmit = async (values: any) => {
    if (isSubmitting || !form.formState.isDirty) {
      console.log("Form is submitting or hasn't changed, skipping submission");
      return;
    }
    
    setInternalIsSubmitting(true);
    try {
      // Always ensure subscription data is included, no conditionals
      if (!values.subscriptionPlan) {
        console.log("SalonForm submit: Missing subscriptionPlan, setting default");
        values.subscriptionPlan = "Baspaket";
      }
      
      if (!values.subscriptionType) {
        console.log("SalonForm submit: Missing subscriptionType, using default");
        values.subscriptionType = "monthly";
      }
      
      // Debug to see values submitted to backend
      console.log("SalonForm submitting with values:", values);
      console.log("Final subscription values in submission:", {
        plan: values.subscriptionPlan,
        type: values.subscriptionType
      });
      
      await onSubmit(values);
    } catch (error) {
      console.error("Form submission error:", error);
    } finally {
      setInternalIsSubmitting(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        <div className="space-y-4">
          <BasicInfoFields form={form} />
        </div>
        
        <div className="space-y-4">
          <ContactFields form={form} />
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
        
        {/* Always show SubscriptionField for both editing and creating */}
        <div className="space-y-4">
          <SubscriptionField form={form} />
        </div>
        
        {/* Debug information */}
        <div className="bg-gray-50 p-3 rounded-md text-gray-500 my-2 text-xs">
          <div><strong>Form Status:</strong> {formState.isDirty ? 'Ändrad' : 'Oförändrad'}</div>
          {formState.isDirty && (
            <div>
              <strong>Ändrade fält:</strong> {Object.keys(formState.dirtyFields).filter(key => formState.dirtyFields[key]).join(', ') || 'Inga'}
            </div>
          )}
        </div>

        <div className="flex justify-end pt-2">
          <Button 
            type="submit" 
            disabled={isSubmitting || !form.formState.isDirty}
            className="w-full sm:w-auto px-6"
          >
            {isSubmitting ? "Sparar..." : isEditing ? "Uppdatera" : "Skapa"}
          </Button>
        </div>
      </form>
    </Form>
  );
};
