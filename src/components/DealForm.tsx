import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { FormFields } from "./deal-form/FormFields";
import { PriceFields } from "./deal-form/PriceFields";
import { LocationFields } from "./deal-form/LocationFields";
import { formSchema, FormValues } from "./deal-form/schema";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { CATEGORIES, CITIES } from "@/constants/app-constants";

interface DealFormProps {
  onSubmit: (values: FormValues) => Promise<void>;
  isSubmitting?: boolean;
  initialValues?: FormValues;
}

export const DealForm = ({ onSubmit, isSubmitting = false, initialValues }: DealFormProps) => {
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: initialValues || {
      title: "",
      description: "",
      imageUrl: "",
      originalPrice: "",
      discountedPrice: "",
      category: "",
      city: "",
      timeRemaining: "",
      featured: false,
      salon_id: undefined,
    },
  });

  const handleImageSelected = (imageUrl: string) => {
    form.setValue("imageUrl", imageUrl);
  };

  const handleSubmit = async (values: FormValues) => {
    try {
      await onSubmit(values);

      // Only create Stripe product if this is a new deal (no initialValues)
      if (!initialValues) {
        // Get the newly created deal's ID from the response
        const { data: deals, error: dealsError } = await supabase
          .from('deals')
          .select('id')
          .order('created_at', { ascending: false })
          .limit(1);

        if (dealsError) {
          console.error('Error fetching new deal:', dealsError);
          throw dealsError;
        }

        const dealId = deals?.[0]?.id;
        if (!dealId) {
          throw new Error('Could not find newly created deal');
        }

        // Create Stripe product and price
        const { error } = await supabase.functions.invoke('create-stripe-product', {
          body: {
            title: values.title,
            description: values.description,
            discountedPrice: parseInt(values.discountedPrice),
            dealId: dealId,
          },
        });

        if (error) {
          console.error('Error creating Stripe product:', error);
          toast.error("Kunde inte skapa Stripe-produkt för erbjudandet.");
          return;
        }
      }
    } catch (error) {
      console.error('Error:', error);
      toast.error("Något gick fel när erbjudandet skulle sparas.");
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        <FormFields form={form} handleImageSelected={handleImageSelected} />
        <PriceFields form={form} />
        <LocationFields form={form} categories={CATEGORIES} cities={CITIES} />

        <FormField
          control={form.control}
          name="timeRemaining"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Giltighetstid</FormLabel>
              <FormControl>
                <Input placeholder="t.ex. 2 dagar kvar" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="featured"
          render={({ field }) => (
            <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
              <FormControl>
                <Checkbox
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
              <div className="space-y-1 leading-none">
                <FormLabel>Utvalt erbjudande</FormLabel>
                <p className="text-sm text-muted-foreground">
                  Detta erbjudande kommer att visas i sektionen för utvalda erbjudanden
                </p>
              </div>
            </FormItem>
          )}
        />

        <Button type="submit" className="w-full" disabled={isSubmitting}>
          {isSubmitting ? "Sparar..." : "Spara erbjudande"}
        </Button>
      </form>
    </Form>
  );
};