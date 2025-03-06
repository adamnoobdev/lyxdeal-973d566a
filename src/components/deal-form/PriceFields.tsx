
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { UseFormReturn } from "react-hook-form";
import * as z from "zod";
import { formSchema } from "./schema";
import { Checkbox } from "@/components/ui/checkbox";
import { useEffect } from "react";

interface PriceFieldsProps {
  form: UseFormReturn<z.infer<typeof formSchema>>;
}

export const PriceFields = ({ form }: PriceFieldsProps) => {
  const isFree = form.watch("is_free");

  // When "is_free" is toggled, update only the discounted price field
  useEffect(() => {
    if (isFree) {
      form.setValue("discountedPrice", "0");
    } else {
      // Clear 0 values for discounted price if un-checking free
      const currentDiscountedPrice = form.getValues("discountedPrice");
      
      if (currentDiscountedPrice === "0") {
        form.setValue("discountedPrice", "");
      }
    }
  }, [isFree, form]);

  return (
    <>
      <FormField
        control={form.control}
        name="is_free"
        render={({ field }) => (
          <FormItem className="flex flex-row items-start space-x-3 space-y-0 mb-4">
            <FormControl>
              <Checkbox
                checked={field.value}
                onCheckedChange={field.onChange}
              />
            </FormControl>
            <div className="space-y-1 leading-none">
              <FormLabel>Gratis erbjudande</FormLabel>
            </div>
          </FormItem>
        )}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <FormField
          control={form.control}
          name="originalPrice"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Ordinarie pris (SEK)</FormLabel>
              <FormControl>
                <Input 
                  type="number" 
                  placeholder="1000" 
                  {...field} 
                  // Always allow editing the original price
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="discountedPrice"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Rabatterat pris (SEK)</FormLabel>
              <FormControl>
                <Input 
                  type="number" 
                  placeholder={isFree ? "0" : "750"} 
                  {...field} 
                  disabled={isFree}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
    </>
  );
};
