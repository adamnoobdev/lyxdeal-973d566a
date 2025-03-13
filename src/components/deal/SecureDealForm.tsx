
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
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
import { supabase } from "@/integrations/supabase/client";
import { getAvailableDiscountCode, markDiscountCodeAsUsed } from "@/utils/discountCodeUtils";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

const formSchema = z.object({
  name: z.string().min(2, { message: "Vänligen ange ditt namn" }),
  email: z.string().email({ message: "Vänligen ange en giltig e-postadress" }),
  phone: z.string().min(6, { message: "Vänligen ange ett giltigt telefonnummer" }),
});

type FormValues = z.infer<typeof formSchema>;

interface SecureDealFormProps {
  dealId: number;
  dealTitle: string;
  onSuccess?: () => void;
}

export const SecureDealForm = ({ 
  dealId, 
  dealTitle,
  onSuccess 
}: SecureDealFormProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
    },
  });

  const handleSubmit = async (values: FormValues) => {
    setIsSubmitting(true);
    
    try {
      // 1. Hämta en tillgänglig rabattkod
      const code = await getAvailableDiscountCode(dealId);
      
      if (!code) {
        toast.error("Tyvärr finns det inga fler koder tillgängliga för detta erbjudande.");
        return;
      }
      
      // 2. Markera koden som använd och koppla till kundinformation
      await markDiscountCodeAsUsed(code, {
        name: values.name,
        email: values.email,
        phone: values.phone
      });
      
      // 3. Skicka e-post med rabattkoden
      const { error } = await supabase.functions.invoke("send-discount-email", {
        body: {
          email: values.email,
          name: values.name,
          phone: values.phone,
          code: code,
          dealTitle: dealTitle
        },
      });
      
      if (error) {
        throw new Error(`Fel vid sändning av e-post: ${error.message}`);
      }
      
      // 4. Skapa en purchase-post i databasen
      const { error: purchaseError } = await supabase
        .from("purchases")
        .insert({
          customer_email: values.email,
          deal_id: dealId,
          discount_code: code,
        });
        
      if (purchaseError) {
        console.error("Error creating purchase record:", purchaseError);
        // Vi fortsätter ändå eftersom rabattkoden redan är genererad och skickad
      }
      
      // 5. Visa bekräftelse
      toast.success("Grattis! Din rabattkod har skickats till din e-post.");
      setIsSuccess(true);
      
      // 6. Återställ formuläret
      form.reset();
      
      // 7. Anropa success callback om tillhandahållen
      if (onSuccess) {
        onSuccess();
      }
      
    } catch (error) {
      console.error("Error securing deal:", error);
      toast.error("Något gick fel. Vänligen försök igen senare.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-md mx-auto bg-white p-6 rounded-lg shadow-md">
      {isSuccess ? (
        <div className="text-center space-y-4">
          <div className="w-16 h-16 bg-green-100 rounded-full mx-auto flex items-center justify-center">
            <svg className="w-8 h-8 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
            </svg>
          </div>
          <h2 className="text-2xl font-semibold text-gray-800">Tack!</h2>
          <p className="text-gray-600">
            Din rabattkod har skickats till din e-post. 
            Koden är giltig i 72 timmar från nu.
          </p>
          <Button 
            className="mt-4" 
            onClick={() => setIsSuccess(false)}
          >
            Säkra ett annat erbjudande
          </Button>
        </div>
      ) : (
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
            <h2 className="text-2xl font-semibold text-center text-gray-800 mb-6">
              Säkra detta erbjudande
            </h2>
            
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Namn</FormLabel>
                  <FormControl>
                    <Input placeholder="Ditt namn" {...field} disabled={isSubmitting} />
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
                      disabled={isSubmitting}
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
                  <FormLabel>Telefonnummer</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="07XXXXXXXX" 
                      type="tel"
                      {...field} 
                      disabled={isSubmitting}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <Button 
              type="submit" 
              className="w-full bg-primary hover:bg-primary/90" 
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Skickar...
                </>
              ) : (
                'Säkra erbjudande'
              )}
            </Button>
            
            <p className="text-xs text-gray-500 text-center">
              Genom att klicka på "Säkra erbjudande" godkänner du våra 
              användarvillkor och integritetspolicy.
            </p>
          </form>
        </Form>
      )}
    </div>
  );
};
