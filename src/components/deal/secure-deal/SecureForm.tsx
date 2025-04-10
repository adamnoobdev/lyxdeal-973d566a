
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
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
import { Loader2 } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { useEffect } from "react";
import { LoadingButton } from "@/components/ui/loading-button";

// Validera svenskt mobilnummer (börjar med 07)
const phoneRegex = /^07[0-9]{8}$/;

const formSchema = z.object({
  name: z.string().min(2, { message: "Vänligen ange ditt namn" }),
  email: z.string().email({ message: "Vänligen ange en giltig e-postadress" }),
  phone: z.string()
    .min(6, { message: "Vänligen ange ett giltigt telefonnummer" })
    .regex(phoneRegex, { 
      message: "Vänligen ange ett giltigt svenskt mobilnummer (07XXXXXXXX)" 
    }),
  subscribeToNewsletter: z.boolean().default(false),
});

export type SecureFormValues = z.infer<typeof formSchema>;

interface SecureFormProps {
  onSubmit: (values: SecureFormValues) => Promise<void>;
  isSubmitting: boolean;
}

export const SecureForm = ({ onSubmit, isSubmitting }: SecureFormProps) => {
  const form = useForm<SecureFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      subscribeToNewsletter: false,
    },
    mode: "onBlur", // Validera vid blur för bättre användarupplevelse
  });

  // Hjälpfunktion för att debugga formuläret
  useEffect(() => {
    const subscription = form.watch(() => {
      console.log("Form values changed:", form.getValues());
    });
    return () => subscription.unsubscribe();
  }, [form]);

  const handleSubmit = async (values: SecureFormValues) => {
    console.log("Form submitted with values:", values);
    try {
      await onSubmit(values);
    } catch (error) {
      console.error("Error submitting form:", error);
    }
  };

  return (
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
              <FormMessage className="text-red-500" />
              <p className="text-xs text-muted-foreground">
                Ange ett svenskt mobilnummer som börjar med 07, t.ex. 0712345678
              </p>
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="subscribeToNewsletter"
          render={({ field }) => (
            <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
              <FormControl>
                <Checkbox
                  checked={field.value}
                  onCheckedChange={field.onChange}
                  disabled={isSubmitting}
                />
              </FormControl>
              <div className="space-y-1 leading-none">
                <FormLabel>Ta del av exklusiva rabatter</FormLabel>
                <p className="text-sm text-muted-foreground">
                  Få exklusiva erbjudanden och uppdateringar skickade direkt till din inkorg.
                </p>
              </div>
            </FormItem>
          )}
        />
        
        <LoadingButton 
          type="submit" 
          className="w-full" 
          loading={isSubmitting}
        >
          Säkra erbjudande
        </LoadingButton>
        
        <p className="text-xs text-gray-500 text-center">
          Genom att klicka på "Säkra erbjudande" godkänner du våra 
          användarvillkor och integritetspolicy.
        </p>
      </form>
    </Form>
  );
};
