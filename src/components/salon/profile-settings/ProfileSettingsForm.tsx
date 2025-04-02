
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form } from "@/components/ui/form";
import { BasicInfoFields } from "./BasicInfoFields";
import { ContactFields } from "@/components/admin/salons/form/ContactFields";
import { SubmitButton } from "./SubmitButton";
import { profileSchema, ProfileFormValues } from "./schema";
import { supabase } from "@/integrations/supabase/client";
import { useState } from "react";
import { toast } from "sonner";
import { Card, CardContent } from "@/components/ui/card";

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
    },
  });

  const onSubmit = async (values: ProfileFormValues) => {
    setIsSubmitting(true);
    try {
      // Ta bort extra fält innan uppdatering
      const { fullAddress, street, postalCode, city, ...salonData } = values;
      
      // Uppdatera bara telefon och adress, inte namn eller mejl
      const { error } = await supabase
        .from("salons")
        .update({
          phone: salonData.phone,
          address: values.address || values.fullAddress
        })
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
    <Card>
      <CardContent className="pt-6">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <BasicInfoFields form={form} readOnly={true} />
            <ContactFields form={form} />
            <SubmitButton isSubmitting={isSubmitting} />
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};
