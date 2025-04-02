
import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { submitPartnerRequest } from "@/hooks/usePartnerRequests";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { Checkbox } from "@/components/ui/checkbox";
import { Link } from "react-router-dom";
import { MapboxAddressInput, type AddressParts } from "@/components/common/MapboxAddressInput";

const formSchema = z.object({
  name: z.string().min(2, { message: "Namn måste vara minst 2 tecken." }),
  business_name: z.string().min(2, { message: "Företagsnamn måste vara minst 2 tecken." }),
  email: z.string().email({ message: "Ogiltig e-postadress." }),
  phone: z.string().min(6, { message: "Telefonnummer måste vara minst 6 tecken." }),
  address: z.string().min(5, { message: "En fullständig adress krävs." }),
  termsAccepted: z.boolean().refine(val => val === true, {
    message: "Du måste acceptera våra allmänna villkor"
  }),
  privacyAccepted: z.boolean().refine(val => val === true, {
    message: "Du måste acceptera vår integritetspolicy"
  }),
});

export type PartnerFormValues = z.infer<typeof formSchema>;

interface PartnerFormProps {
  selectedPlan: {
    title: string;
    paymentType: 'monthly' | 'yearly';
    price: number;
    dealCount: number;
  } | null;
}

export const PartnerForm = ({ selectedPlan }: PartnerFormProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [addressParts, setAddressParts] = useState<AddressParts | undefined>();
  const navigate = useNavigate();

  const form = useForm<PartnerFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      business_name: "",
      email: "",
      phone: "",
      address: "",
      termsAccepted: false,
      privacyAccepted: false,
    },
  });

  const onSubmit = async (values: PartnerFormValues) => {
    if (!selectedPlan) {
      toast.error("Inget paket valt. Vänligen välj ett paket först.");
      navigate("/partner");
      return;
    }

    setIsSubmitting(true);
    try {
      // Prepare the data with plan information and ensure required fields are present
      const requestData = {
        name: values.name,
        business_name: values.business_name,
        email: values.email,
        phone: values.phone,
        address: values.address,
        message: "", // Tom sträng istället för att ta bort helt för att upprätthålla API-kompatibilitet
        plan_title: selectedPlan.title,
        plan_payment_type: selectedPlan.paymentType,
        plan_price: selectedPlan.price,
        plan_deal_count: selectedPlan.dealCount
      };
      
      const result = await submitPartnerRequest(requestData);
      
      if (result.success) {
        toast.success("Din ansökan har skickats!");
        
        // If we got a redirect URL, the user will be redirected to Stripe Checkout
        if (result.redirectUrl) {
          // The redirect is handled in submitPartnerRequest
          return;
        }
        
        // Otherwise navigate to success page
        navigate("/partner/success");
      } else {
        throw new Error(result.error || "Ett okänt fel inträffade");
      }
    } catch (error) {
      console.error("Error submitting partner request:", error);
      toast.error(error.message || "Något gick fel. Vänligen försök igen.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleAddressChange = (address: string, parts?: AddressParts) => {
    form.setValue("address", address);
    if (parts) {
      setAddressParts(parts);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Ditt namn *</FormLabel>
                <FormControl>
                  <Input placeholder="Anna Andersson" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="business_name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Företagsnamn *</FormLabel>
                <FormControl>
                  <Input placeholder="Din Salong AB" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>E-post *</FormLabel>
                <FormControl>
                  <Input placeholder="ditt@företag.se" type="email" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="phone"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Telefon *</FormLabel>
                <FormControl>
                  <Input placeholder="070-123 45 67" type="tel" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="address"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Adress *</FormLabel>
              <FormControl>
                <MapboxAddressInput
                  id="address" 
                  defaultValue={field.value}
                  onChange={handleAddressChange}
                  placeholder="Sök din adress här..."
                  required
                  error={!!form.formState.errors.address}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="space-y-4">
          <FormField
            control={form.control}
            name="termsAccepted"
            render={({ field }) => (
              <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                <FormControl>
                  <Checkbox
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel className="text-sm font-medium leading-none">
                    Jag accepterar <Link to="/terms" className="text-primary hover:underline" target="_blank">allmänna villkor</Link> *
                  </FormLabel>
                  <FormMessage />
                </div>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="privacyAccepted"
            render={({ field }) => (
              <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                <FormControl>
                  <Checkbox
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel className="text-sm font-medium leading-none">
                    Jag accepterar <Link to="/privacy" className="text-primary hover:underline" target="_blank">integritetspolicy</Link> *
                  </FormLabel>
                  <FormMessage />
                </div>
              </FormItem>
            )}
          />
        </div>

        <Button 
          type="submit" 
          className="w-full"
          disabled={isSubmitting}
        >
          {isSubmitting ? "Skickar..." : "Skicka ansökan"}
        </Button>
      </form>
    </Form>
  );
};
