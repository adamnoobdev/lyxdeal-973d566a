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

const categories = [
  "Laserhårborttagning",
  "Fillers",
  "Rynkbehandlingar",
  "Hudvård",
  "Hårvård",
  "Naglar",
  "Massage",
];

const cities = [
  "Stockholm",
  "Göteborg",
  "Malmö",
  "Uppsala",
  "Västerås",
  "Örebro",
  "Linköping",
  "Helsingborg",
  "Jönköping",
  "Norrköping",
];

interface DealFormProps {
  onSubmit: (values: FormValues) => Promise<void>;
}

export const DealForm = ({ onSubmit }: DealFormProps) => {
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      description: "",
      imageUrl: "",
      originalPrice: "",
      discountedPrice: "",
      category: "",
      city: "",
      timeRemaining: "",
      featured: false,
    },
  });

  const handleImageSelected = (imageUrl: string) => {
    form.setValue("imageUrl", imageUrl);
  };

  const handleSubmit = async (values: FormValues) => {
    try {
      // Först skapa erbjudandet i databasen
      const { data: deal, error: dealError } = await supabase
        .from('deals')
        .insert({
          title: values.title,
          description: values.description,
          image_url: values.imageUrl,
          original_price: parseInt(values.originalPrice),
          discounted_price: parseInt(values.discountedPrice),
          category: values.category,
          city: values.city,
          time_remaining: values.timeRemaining,
          featured: values.featured,
        })
        .select()
        .single();

      if (dealError) throw dealError;

      // Skapa Stripe-produkt och uppdatera erbjudandet med Stripe price ID
      const { error: stripeError } = await supabase.functions.invoke('create-stripe-product', {
        body: {
          title: values.title,
          description: values.description,
          discountedPrice: parseInt(values.discountedPrice),
          dealId: deal.id,
        },
      });

      if (stripeError) {
        toast.error("Kunde inte skapa Stripe-produkt");
        throw stripeError;
      }

      await onSubmit(values);
      toast.success("Erbjudandet har skapats!");
    } catch (error) {
      console.error('Error:', error);
      toast.error("Något gick fel när erbjudandet skulle skapas.");
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        <FormFields form={form} handleImageSelected={handleImageSelected} />
        <PriceFields form={form} />
        <LocationFields form={form} categories={categories} cities={cities} />

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

        <Button type="submit" className="w-full">
          {form.formState.isSubmitting ? "Skapar erbjudande..." : "Skapa erbjudande"}
        </Button>
      </form>
    </Form>
  );
};