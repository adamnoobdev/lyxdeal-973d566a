
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form } from "@/components/ui/form";
import { BasicInfoFields } from "./BasicInfoFields";
import { ContactInfoFields } from "./ContactInfoFields";
import { SubmitButton } from "./SubmitButton";
import { profileSchema, ProfileFormValues } from "./schema";
import { supabase } from "@/integrations/supabase/client";
import { useState } from "react";
import { toast } from "sonner";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

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
      address: salon.address || "",
    },
  });

  const onSubmit = async (values: ProfileFormValues) => {
    setIsSubmitting(true);
    try {
      const { error } = await supabase
        .from("salons")
        .update({
          phone: values.phone,
          address: values.address
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
    <Card className="border border-muted-foreground/10 shadow-sm">
      <CardHeader className="border-b bg-muted/30 pb-4">
        <CardTitle className="text-xl font-medium">Kontaktuppgifter</CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <BasicInfoFields form={form} readOnly={true} />
            <ContactInfoFields form={form} />
            <SubmitButton isSubmitting={isSubmitting} />
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};
