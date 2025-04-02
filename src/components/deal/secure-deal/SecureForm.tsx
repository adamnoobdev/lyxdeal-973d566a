
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { LoadingButton } from "@/components/ui/loading-button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Loader2, Mail, Phone, User } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";

const formSchema = z.object({
  name: z.string().min(2, { message: "Vänligen ange ditt namn" }),
  email: z.string().email({ message: "Vänligen ange en giltig e-postadress" }),
  phone: z.string().min(6, { message: "Vänligen ange ett giltigt telefonnummer" }),
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
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <h2 className="text-2xl font-semibold text-center text-gray-800 mb-6 relative">
          Säkra detta erbjudande
          <span className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-16 h-1 bg-primary rounded-full mt-2"></span>
        </h2>
        
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="flex items-center gap-2">
                <User className="h-4 w-4 text-primary" />
                Namn
              </FormLabel>
              <FormControl>
                <Input 
                  placeholder="Ditt namn" 
                  {...field} 
                  disabled={isSubmitting} 
                  className="focus-visible:ring-primary"
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
              <FormLabel className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-primary" />
                E-post
              </FormLabel>
              <FormControl>
                <Input 
                  placeholder="din.epost@exempel.se" 
                  type="email"
                  {...field} 
                  disabled={isSubmitting}
                  className="focus-visible:ring-primary"
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
              <FormLabel className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-primary" />
                Telefonnummer
              </FormLabel>
              <FormControl>
                <Input 
                  placeholder="07XXXXXXXX" 
                  type="tel"
                  {...field} 
                  disabled={isSubmitting}
                  className="focus-visible:ring-primary"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="subscribeToNewsletter"
          render={({ field }) => (
            <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4 shadow-sm hover:bg-gray-50 transition-colors">
              <FormControl>
                <Checkbox
                  checked={field.value}
                  onCheckedChange={field.onChange}
                  disabled={isSubmitting}
                  className="data-[state=checked]:bg-primary data-[state=checked]:border-primary"
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
          className="w-full bg-primary hover:bg-primary/90 text-white py-3 rounded-md transition-all transform hover:scale-[1.02]" 
          disabled={isSubmitting}
          loading={isSubmitting}
        >
          {isSubmitting ? 'Skickar...' : 'Säkra erbjudande'}
        </LoadingButton>
        
        <p className="text-xs text-gray-500 text-center px-4">
          Genom att klicka på "Säkra erbjudande" godkänner du våra 
          användarvillkor och integritetspolicy.
        </p>
      </form>
    </Form>
  );
};
