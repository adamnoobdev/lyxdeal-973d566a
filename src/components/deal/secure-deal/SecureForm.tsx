
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
import { Link } from "react-router-dom";

const formSchema = z.object({
  name: z.string().min(2, { message: "Vänligen ange ditt namn" }),
  email: z.string().email({ message: "Vänligen ange en giltig e-postadress" }),
  phone: z.string().min(6, { message: "Vänligen ange ett giltigt telefonnummer" }),
  termsAccepted: z.boolean().refine(val => val === true, {
    message: "Du måste godkänna villkoren för att fortsätta"
  })
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
      termsAccepted: false
    },
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
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
        
        <FormField
          control={form.control}
          name="termsAccepted"
          render={({ field }) => (
            <FormItem className="flex flex-row items-start space-x-3 space-y-0 pt-2">
              <FormControl>
                <Checkbox
                  checked={field.value}
                  onCheckedChange={field.onChange}
                  disabled={isSubmitting}
                />
              </FormControl>
              <div className="space-y-1 leading-none">
                <FormLabel className="text-sm font-normal">
                  Jag godkänner Lyxdeals{' '}
                  <Link to="/terms" target="_blank" className="text-primary hover:underline">
                    allmänna villkor
                  </Link>{' '}
                  och{' '}
                  <Link to="/privacy" target="_blank" className="text-primary hover:underline">
                    integritetspolicy
                  </Link>
                </FormLabel>
                <FormMessage />
              </div>
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
  );
};
