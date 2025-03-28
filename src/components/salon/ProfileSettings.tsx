
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
import { useState, useEffect } from "react";

const profileSchema = z.object({
  name: z.string().min(2, "Namnet måste vara minst 2 tecken"),
  email: z.string().email("Ogiltig e-postadress"),
  phone: z.string().optional(),
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
  
  // Dela upp adressen i fält
  const splitAddress = (address: string | null) => {
    const result = {
      street: '',
      postalCode: '',
      city: ''
    };
    
    if (!address) return result;
    
    const addressParts = address.split(',');
    if (addressParts.length > 0) {
      result.street = addressParts[0].trim();
      
      // Försök extrahera postnummer och stad från andra delen
      if (addressParts.length > 1) {
        const cityPostalParts = addressParts[1].trim().split(' ');
        // Leta efter postnummer (5-6 tecken, oftast med mellanslag som XXX XX)
        const postalCodeRegex = /^\d{3}\s?\d{2}$/;
        const postalCodeIndex = cityPostalParts.findIndex(part => postalCodeRegex.test(part.trim()));
        
        if (postalCodeIndex >= 0) {
          result.postalCode = cityPostalParts[postalCodeIndex];
          // Staden är resten av texten efter postnumret
          result.city = cityPostalParts.slice(postalCodeIndex + 1).join(' ');
        } else {
          // Om inget postnummer hittas, anta att allt är stad
          result.city = addressParts[1].trim();
        }
      }
    }
    
    return result;
  };
  
  const addressParts = splitAddress(salon.address);
  
  const form = useForm({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: salon.name,
      email: salon.email,
      phone: salon.phone || "",
      street: addressParts.street,
      postalCode: addressParts.postalCode,
      city: addressParts.city,
      address: salon.address || "",
      password: "",
    },
  });
  
  // Uppdatera adressfältet när de individuella fälten ändras
  useEffect(() => {
    const subscription = form.watch((value, { name }) => {
      if (name === 'street' || name === 'postalCode' || name === 'city') {
        const street = value.street || '';
        const postalCode = value.postalCode || '';
        const city = value.city || '';
        
        // Skapa fullständig adress
        let fullAddress = '';
        if (street) fullAddress += street;
        if (postalCode) {
          if (fullAddress) fullAddress += ', ';
          fullAddress += postalCode;
        }
        if (city) {
          if (fullAddress && !fullAddress.endsWith(' ')) fullAddress += ' ';
          fullAddress += city;
        }
        
        form.setValue('address', fullAddress);
      }
    });
    
    return () => subscription.unsubscribe();
  }, [form]);

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

      // Kombinera adressfälten till fullständig adress
      const street = values.street?.trim() || '';
      const postalCode = values.postalCode?.trim() || '';
      const city = values.city?.trim() || '';
      
      // Skapa fullständig adress
      let fullAddress = '';
      if (street) fullAddress += street;
      if (postalCode) {
        if (fullAddress) fullAddress += ', ';
        fullAddress += postalCode;
      }
      if (city) {
        if (fullAddress && !fullAddress.endsWith(' ')) fullAddress += ' ';
        fullAddress += city;
      }

      // Remove password from values before updating salon data
      const { password, street: _, postalCode: __, city: ___, ...salonData } = values;
      
      // Uppdatera med den kombinerade adressen
      const dataToUpdate = {
        ...salonData,
        address: fullAddress || null
      };

      const { error } = await supabase
        .from("salons")
        .update(dataToUpdate)
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
