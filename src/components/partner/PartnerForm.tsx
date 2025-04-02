
import { Form } from "@/components/ui/form";
import { usePartnerForm } from "./form/usePartnerForm";
import { PersonalInfoFields } from "./form/PersonalInfoFields";
import { ContactInfoFields } from "./form/ContactInfoFields";
import { AddressField } from "./form/AddressField";
import { TermsAndPrivacyFields } from "./form/TermsAndPrivacyFields";
import { SubmitButton } from "./form/SubmitButton";
import { type PartnerFormValues } from "./PartnerFormSchema";

interface PartnerFormProps {
  selectedPlan: {
    title: string;
    paymentType: 'monthly' | 'yearly';
    price: number;
    dealCount: number;
  } | null;
}

export const PartnerForm = ({ selectedPlan }: PartnerFormProps) => {
  const { form, isSubmitting, onSubmit } = usePartnerForm({ selectedPlan });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <PersonalInfoFields form={form} />
        <ContactInfoFields form={form} />
        <AddressField form={form} />
        <TermsAndPrivacyFields form={form} />
        <SubmitButton isSubmitting={isSubmitting} />
      </form>
    </Form>
  );
};

export type { PartnerFormValues };
