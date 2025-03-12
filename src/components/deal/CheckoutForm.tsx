
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
import { useState } from "react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

const formSchema = z.object({
  name: z.string().min(2, {
    message: "Namnet måste vara minst 2 tecken.",
  }),
  email: z.string().email({
    message: "Var god ange en giltig e-postadress.",
  }),
  phone: z.string().min(6, {
    message: "Var god ange ett giltigt telefonnummer.",
  }),
});

interface CheckoutFormProps {
  dealId: number;
  onSuccess: (code: string) => void;
  onCancel: () => void;
  isFree?: boolean;
}

export const CheckoutForm = ({
  dealId,
  onSuccess,
  onCancel,
  isFree = false,
}: CheckoutFormProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
    },
  });

  const handleSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      setIsSubmitting(true);
      
      console.log("Submitting form for deal:", dealId, "Values:", values);
      
      // Call the Supabase edge function directly instead of using a non-existent API route
      const { data, error } = await supabase.functions.invoke('checkout-deal', {
        body: {
          dealId,
          customerInfo: values,
        }
      });
      
      if (error) {
        console.error("Checkout error:", error);
        throw new Error(error.message || "Ett fel uppstod vid säkring av erbjudandet.");
      }
      
      console.log("Checkout success:", data);
      
      if (data.free && data.code) {
        // För gratiserbjudanden, visa koden direkt
        toast.success("En bekräftelse med rabattkoden har skickats till din e-post");
        onSuccess(data.code);
      } else if (data.url) {
        // För betalerbjudanden, omdirigera till Stripe
        window.location.href = data.url;
      } else {
        // Detta bör inte hända, men vi hanterar det ändå
        toast.error("Oväntat svar från servern. Försök igen senare.");
      }
    } catch (error) {
      console.error("Checkout error:", error);
      
      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error("Ett fel uppstod. Försök igen senare.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
        <div className="space-y-4">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Namn <span className="text-red-500">*</span></FormLabel>
                <FormControl>
                  <Input 
                    placeholder="Ditt namn" 
                    {...field} 
                    className="bg-gray-50/50"
                    required
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>E-post <span className="text-red-500">*</span></FormLabel>
                <FormControl>
                  <Input 
                    placeholder="din.epost@exempel.se" 
                    type="email" 
                    {...field}
                    className="bg-gray-50/50"
                    required
                  />
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
                <FormLabel>Telefonnummer <span className="text-red-500">*</span></FormLabel>
                <FormControl>
                  <Input 
                    placeholder="070-123 45 67" 
                    type="tel" 
                    {...field}
                    className="bg-gray-50/50"
                    required
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        
        <div className="rounded-lg bg-blue-50 border border-blue-100 p-4 text-sm text-blue-700">
          <p>
            Genom att säkra detta erbjudande godkänner du att vi skickar dig en rabattkod
            till din angivna e-post. Koden är giltig i 72 timmar.
          </p>
        </div>
        
        <div className="flex flex-col gap-2 pt-2">
          <Button type="submit" disabled={isSubmitting} size="lg" className="w-full">
            {isSubmitting ? "Bearbetar..." : "Säkra rabattkod"}
          </Button>
          <Button 
            type="button" 
            variant="outline" 
            onClick={onCancel}
            disabled={isSubmitting}
            size="lg"
          >
            Avbryt
          </Button>
        </div>
      </form>
    </Form>
  );
};
