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
import { createStripeProductForDeal } from "@/utils/stripeUtils";
import { toast } from "sonner";
import { CATEGORIES, CITIES } from "@/constants/app-constants";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useEffect } from "react";

interface DealFormProps {
  onSubmit: (values: FormValues) => Promise<void>;
  isSubmitting?: boolean;
  initialValues?: FormValues;
}

export const DealForm = ({ onSubmit, isSubmitting = false, initialValues }: DealFormProps) => {
  const queryClient = useQueryClient();
  
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

  const { data: salons = [] } = useQuery({
    queryKey: ["salons"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("salons")
        .select("id, name")
        .order("name");
      
      if (error) {
        console.error("Error fetching salons:", error);
        throw error;
      }
      return data;
    },
  });

  useEffect(() => {
    // Subscribe to changes in the salons table
    const channel = supabase
      .channel('schema-db-changes')
      .on(
        'postgres_changes',
        {
          event: '*', // Listen to all changes (INSERT, UPDATE, DELETE)
          schema: 'public',
          table: 'salons'
        },
        () => {
          // Invalidate and refetch the salons query
          queryClient.invalidateQueries({ queryKey: ["salons"] });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [queryClient]);

  const handleImageSelected = (imageUrl: string) => {
    form.setValue("imageUrl", imageUrl);
  };

  const handleSubmit = async (values: FormValues) => {
    try {
      if (!values.salon_id) {
        toast.error("Du måste välja en salong");
        return;
      }

      await onSubmit(values);

      // Only create Stripe product if this is a new deal
      if (!initialValues) {
        await createStripeProductForDeal(values);
      }
    } catch (error) {
      console.error('Error:', error);
      toast.error("Något gick fel när erbjudandet skulle sparas.");
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="salon_id"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Salong</FormLabel>
              <FormControl>
                <select
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  {...field}
                  onChange={(e) => field.onChange(e.target.value ? Number(e.target.value) : undefined)}
                  value={field.value || ""}
                >
                  <option value="">Välj salong...</option>
                  {salons.map((salon) => (
                    <option key={salon.id} value={salon.id}>
                      {salon.name}
                    </option>
                  ))}
                </select>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

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