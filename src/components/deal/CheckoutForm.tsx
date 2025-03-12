
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

const formSchema = z.object({
  name: z.string().min(2, {
    message: "Namnet måste vara minst 2 tecken.",
  }),
  email: z.string().email({
    message: "Var god ange en giltig e-postadress.",
  }),
  phone: z.string().optional(),
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
      
      const response = await fetch("/api/checkout-deal", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          dealId,
          customerInfo: values,
        }),
      });
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error("Checkout error response:", errorText);
        let errorMessage = "Ett fel uppstod vid säkring av erbjudandet.";
        
        try {
          // Försök tolka som JSON om möjligt
          const errorData = JSON.parse(errorText);
          if (errorData.error) {
            errorMessage = errorData.error;
          }
        } catch (e) {
          // Om det inte är JSON, använd hela texten
          errorMessage = errorText || errorMessage;
        }
        
        throw new Error(errorMessage);
      }
      
      const data = await response.json();
      console.log("Checkout success:", data);
      
      if (data.free && data.code) {
        // För gratiserbjudanden, visa koden direkt
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
                <FormLabel>Namn</FormLabel>
                <FormControl>
                  <Input 
                    placeholder="Ditt namn" 
                    {...field} 
                    className="bg-gray-50/50"
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
                <FormLabel>E-post</FormLabel>
                <FormControl>
                  <Input 
                    placeholder="din.epost@exempel.se" 
                    type="email" 
                    {...field}
                    className="bg-gray-50/50"
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
                <FormLabel>Telefonnummer (valfritt)</FormLabel>
                <FormControl>
                  <Input 
                    placeholder="070-123 45 67" 
                    type="tel" 
                    {...field}
                    className="bg-gray-50/50"
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
