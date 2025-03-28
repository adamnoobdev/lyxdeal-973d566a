
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { BasicInfoFields } from "./form/BasicInfoFields";
import { ContactFields } from "./form/ContactFields";
import { PasswordField } from "./form/PasswordField";
import { SubscriptionField } from "./form/SubscriptionField";
import { LoadingButton } from "@/components/ui/loading-button";
import { useEffect } from "react";

// Förbättrat schema med separata adressfält
const formSchema = z.object({
  name: z.string().min(2, {
    message: "Namnet måste vara minst 2 tecken.",
  }),
  email: z.string().email({
    message: "Vänligen ange en giltig e-postadress.",
  }),
  phone: z.string().optional(),
  street: z.string().optional(),
  postalCode: z.string().optional(),
  city: z.string().optional(),
  address: z.string().optional(),
  password: z.string().optional(),
  skipSubscription: z.boolean().optional().default(false),
});

interface SalonFormProps {
  onSubmit: (values: z.infer<typeof formSchema>) => Promise<void>;
  initialValues?: z.infer<typeof formSchema>;
  isEditing?: boolean;
}

export const SalonForm = ({ onSubmit, initialValues, isEditing }: SalonFormProps) => {
  // Dela upp adressen i separata fält om den finns i initialValues
  const processedInitialValues = { ...initialValues };
  
  if (initialValues?.address) {
    const addressParts = initialValues.address.split(',');
    if (addressParts.length > 0) {
      processedInitialValues.street = addressParts[0].trim();
      
      // Försök extrahera postnummer och stad från andra delen
      if (addressParts.length > 1) {
        const cityPostalParts = addressParts[1].trim().split(' ');
        // Leta efter postnummer (5-6 tecken, oftast med mellanslag som XXX XX)
        const postalCodeRegex = /^\d{3}\s?\d{2}$/;
        const postalCodeIndex = cityPostalParts.findIndex(part => postalCodeRegex.test(part.trim()));
        
        if (postalCodeIndex >= 0) {
          processedInitialValues.postalCode = cityPostalParts[postalCodeIndex];
          // Staden är resten av texten efter postnumret
          processedInitialValues.city = cityPostalParts.slice(postalCodeIndex + 1).join(' ');
        } else {
          // Om inget postnummer hittas, anta att allt är stad
          processedInitialValues.city = addressParts[1].trim();
        }
      }
    }
  }

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: processedInitialValues || {
      name: "",
      email: "",
      phone: "",
      street: "",
      postalCode: "",
      city: "",
      address: "",
      password: "",
      skipSubscription: false,
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

  const handleSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      // Kombinera adressfälten innan formuläret skickas
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
      
      // Uppdatera adressfältet med kombinationen
      const submissionValues = {
        ...values,
        address: fullAddress || undefined
      };
      
      // Om adressen är tom, sätt den till undefined
      if (submissionValues.address?.trim() === "") {
        submissionValues.address = undefined;
      }
      
      await onSubmit(submissionValues);
    } catch (error) {
      console.error("Error submitting form:", error);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        <BasicInfoFields form={form} />
        <ContactFields form={form} />
        {isEditing && <PasswordField form={form} />}
        {!isEditing && <SubscriptionField form={form} />}
        
        <div className="flex justify-end gap-4">
          <LoadingButton 
            type="submit" 
            loading={form.formState.isSubmitting}
          >
            Spara
          </LoadingButton>
        </div>
      </form>
    </Form>
  );
};
