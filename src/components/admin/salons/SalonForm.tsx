
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
import { useState, useEffect, forwardRef, useImperativeHandle } from "react";

const formSchema = z.object({
  name: z.string().min(1, {
    message: "Namn krävs"
  }),
  email: z.string().email({
    message: "Ogiltig e-postadress"
  }),
  phone: z.string().optional(),
  street: z.string().optional(),
  postalCode: z.string().optional(),
  city: z.string().optional(),
  address: z.string().optional(),
  password: z.string().optional(),
  skipSubscription: z.boolean().optional().default(false),
  // Always require subscription fields
  subscriptionPlan: z.string().min(1, {
    message: "Prenumerationsplan krävs"
  }),
  subscriptionType: z.string().min(1, {
    message: "Betalningsintervall krävs"
  }),
  // Lägg till validering för subscriptionEndDate
  subscriptionEndDate: z.date().optional(),
  termsAccepted: z.boolean().optional().default(true),
  privacyAccepted: z.boolean().optional().default(true)
});

interface SalonFormProps {
  onSubmit: (values: any) => Promise<void>;
  initialValues?: any;
  isEditing?: boolean;
  isSubmitting?: boolean;
}

export const SalonForm = forwardRef(({
  onSubmit,
  initialValues,
  isEditing,
  isSubmitting: externalIsSubmitting
}: SalonFormProps, ref) => {
  const [internalIsSubmitting, setInternalIsSubmitting] = useState(false);
  const [formState, setFormState] = useState({
    isDirty: false,
    dirtyFields: {} as Record<string, boolean>
  });

  // Use external isSubmitting state if provided, otherwise use internal state
  const isSubmitting = externalIsSubmitting !== undefined ? externalIsSubmitting : internalIsSubmitting;

  // Parse subscriptionEndDate if it's a string
  let parsedInitialValues = { ...initialValues };
  if (initialValues?.subscriptionEndDate && typeof initialValues.subscriptionEndDate === 'string') {
    parsedInitialValues.subscriptionEndDate = new Date(initialValues.subscriptionEndDate);
  }

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
    subscriptionEndDate: undefined,
    termsAccepted: true,
    privacyAccepted: true,
    ...parsedInitialValues
  };

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues
  });

  // Expose form methods to parent component via ref
  useImperativeHandle(ref, () => ({
    setValue: form.setValue,
    getValues: form.getValues,
    formState: form.formState
  }));

  // Debug to see values in the form
  useEffect(() => {
    console.log("SalonForm initialized with values:", form.getValues());
    console.log("Subscription values:", {
      plan: form.getValues("subscriptionPlan"),
      type: form.getValues("subscriptionType"),
      endDate: form.getValues("subscriptionEndDate")
    });

    // Monitor dirty state
    const subscription = form.watch(() => {
      const values = form.getValues();
      const dirtyFields = form.formState.dirtyFields;
      console.log("Form changed:", {
        isDirty: form.formState.isDirty,
        dirtyFields: Object.keys(dirtyFields).filter(key => {
          // Check if the key exists in dirtyFields and is truthy
          return Object.prototype.hasOwnProperty.call(dirtyFields, key) && dirtyFields[key];
        })
      });
      setFormState({
        isDirty: form.formState.isDirty,
        dirtyFields: Object.keys(dirtyFields).reduce((acc, key) => {
          if (Object.prototype.hasOwnProperty.call(dirtyFields, key)) {
            acc[key] = !!dirtyFields[key];
          }
          return acc;
        }, {} as Record<string, boolean>)
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
      
      // Kontrollera och hantera slutdatumet
      if (values.skipSubscription && values.subscriptionEndDate) {
        console.log("SalonForm submit: Using custom end date for subscription:", values.subscriptionEndDate);
      } else if (values.skipSubscription) {
        // Sätt standardslutdatum om det saknas för prenumerationer utan betalningskrav
        const defaultEndDate = new Date();
        defaultEndDate.setFullYear(defaultEndDate.getFullYear() + 1);
        values.subscriptionEndDate = defaultEndDate;
        console.log("SalonForm submit: Setting default end date for skipSubscription:", values.subscriptionEndDate);
      }

      // Debug to see values submitted to backend
      console.log("SalonForm submitting with values:", values);
      console.log("Final subscription values in submission:", {
        plan: values.subscriptionPlan,
        type: values.subscriptionType,
        endDate: values.subscriptionEndDate
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
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-5 w-full max-w-full overflow-hidden">
        <div className="space-y-4 w-full">
          <BasicInfoFields form={form} />
        </div>
        
        <div className="space-y-4 w-full">
          <ContactFields form={form} />
        </div>
        
        {isEditing && (
          <div className="space-y-4 w-full">
            <TermsFields form={form} />
          </div>
        )}
        
        {!isEditing && (
          <div className="space-y-4 w-full">
            <PasswordField form={form} />
          </div>
        )}
        
        {/* Always show SubscriptionField for both editing and creating */}
        <div className="space-y-4 w-full">
          <SubscriptionField form={form} />
        </div>
        
        <div className="flex justify-end w-full">
          <Button type="submit" disabled={isSubmitting || !form.formState.isDirty} className="w-full sm:w-auto px-6">
            {isSubmitting ? "Sparar..." : isEditing ? "Uppdatera" : "Skapa"}
          </Button>
        </div>
      </form>
    </Form>
  );
});

SalonForm.displayName = "SalonForm";
