
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { toast } from "sonner";
import { BasicInfoFields } from "../admin/salons/form/BasicInfoFields";
import { ContactFields } from "../admin/salons/form/ContactFields";
import { PasswordField } from "../admin/salons/form/PasswordField";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { useState } from "react";

const profileSchema = z.object({
  name: z.string().min(2, "Namnet måste vara minst 2 tecken"),
  email: z.string().email("Ogiltig e-postadress"),
  phone: z.string().optional(),
  fullAddress: z.string().optional(),
  street: z.string().optional(),
  postalCode: z.string().optional(),
  city: z.string().optional(),
  address: z.string().optional(),
  password: z.string().min(6, "Lösenordet måste vara minst 6 tecken").optional(),
});

export interface ProfileSettingsProps {
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

export const ProfileSettings = ({ salon, onUpdate }: ProfileSettingsProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const form = useForm({
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

  const onSubmit = async (values: z.infer<typeof profileSchema>) => {
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
    <Card>
      <CardHeader>
        <CardTitle>Profilinställningar</CardTitle>
        <CardDescription>
          Uppdatera din salongs information
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <BasicInfoFields form={form} />
            <ContactFields form={form} />
            <PasswordField form={form} />
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? (
                <span className="flex items-center">
                  <span className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                  Sparar...
                </span>
              ) : (
                "Spara ändringar"
              )}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};
