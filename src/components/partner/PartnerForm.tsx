
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
import { Textarea } from "@/components/ui/textarea";
import { submitPartnerRequest } from "@/hooks/usePartnerRequests";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

const formSchema = z.object({
  name: z.string().min(2, { message: "Namn måste vara minst 2 tecken." }),
  business_name: z.string().min(2, { message: "Företagsnamn måste vara minst 2 tecken." }),
  email: z.string().email({ message: "Ogiltig e-postadress." }),
  phone: z.string().min(6, { message: "Telefonnummer måste vara minst 6 tecken." }),
  address: z.string().optional(),
  message: z.string().optional(),
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
  const navigate = useNavigate();

  const form = useForm<PartnerFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      business_name: "",
      email: "",
      phone: "",
      address: "",
      message: "",
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
        address: values.address || "",
        message: values.message || "",
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

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Ditt namn</FormLabel>
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
                <FormLabel>Företagsnamn</FormLabel>
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
                <FormLabel>E-post</FormLabel>
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
                <FormLabel>Telefon</FormLabel>
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
              <FormLabel>Adress (frivillig)</FormLabel>
              <FormControl>
                <Input placeholder="Gatan 123, 123 45 Staden" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="message"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Meddelande (frivillig)</FormLabel>
              <FormControl>
                <Textarea 
                  placeholder="Om det är något speciellt du vill meddela oss"
                  className="resize-none"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

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
