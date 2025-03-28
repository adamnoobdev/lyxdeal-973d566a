
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form } from "@/components/ui/form";
import { BasicInfoFields } from "@/components/admin/salons/form/BasicInfoFields";
import { ContactFields } from "@/components/admin/salons/form/ContactFields";
import { PasswordField } from "@/components/admin/salons/form/PasswordField";
import { SubmitButton } from "./SubmitButton";
import { profileSchema, ProfileFormValues } from "./schema";
import { supabase } from "@/integrations/supabase/client";
import { useState } from "react";
import { toast } from "sonner";

interface ProfileSettingsFormProps {
  salon: {
    id: number;
    name: string;
    email: string;
    phone: string | null;
    address: string | null;
    user_id: string | null;
  };
  onUpdate: () => void;
}

export const ProfileSettingsForm = ({ salon, onUpdate }: ProfileSettingsFormProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: salon.name,
      email: salon.email,
      phone: salon.phone || "",
      fullAddress: salon.address || "",
      street: "",
      postalCode: "",
      city: "",
      address: salon.address || "",
      password: "",
    },
  });

  const onSubmit = async (values: ProfileFormValues) => {
    setIsSubmitting(true);
    try {
      // If a new password is provided, update it
      if (values.password && salon.user_id) {
        const { error: passwordError } = await supabase.functions.invoke("update-salon-password", {
          body: { 
            userId: salon.user_id,
            newPassword: values.password
          }
        });

        if (passwordError) throw passwordError;
      }

      // Ta bort extra fält innan uppdatering
      const { password, fullAddress, street, postalCode, city, ...salonData } = values;
      
      const { error } = await supabase
        .from("salons")
        .update(salonData)
        .eq("id", salon.id);

      if (error) throw error;

      toast.success("Profilen har uppdaterats");
      onUpdate();
    } catch (error) {
      console.error("Error updating profile:", error);
      toast.error("Kunde inte uppdatera profilen");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <BasicInfoFields form={form} />
        <ContactFields form={form} />
        <PasswordField form={form} />
        <SubmitButton isSubmitting={isSubmitting} />
      </form>
    </Form>
  );
};
