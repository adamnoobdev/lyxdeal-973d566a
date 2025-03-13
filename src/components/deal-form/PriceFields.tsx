
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

  // When "is_free" is toggled, update prices to ensure DB constraints are met
  useEffect(() => {
    if (isFree) {
      // We're still showing 0 in the UI, but the actual value sent will be 1
      form.setValue("discountedPrice", "0");
      // Make sure original price is at least 1 to satisfy DB constraint
      const originalPrice = parseInt(form.getValues("originalPrice"));
      if (isNaN(originalPrice) || originalPrice < 1) {
        form.setValue("originalPrice", "1");
      }
    } else {
      // Clear 0 values for discounted price if un-checking free
      const currentDiscountedPrice = form.getValues("discountedPrice");
      
      if (currentDiscountedPrice === "0") {
        form.setValue("discountedPrice", "1");
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
                  min="1"
                  {...field} 
                  // Always allow editing the original price, but ensure it's at least 1
                  onChange={(e) => {
                    const value = e.target.value;
                    const numValue = parseInt(value);
                    if (value === "" || isNaN(numValue)) {
                      field.onChange("1");
                    } else if (numValue < 1) {
                      field.onChange("1");
                    } else {
                      field.onChange(value);
                    }
                  }}
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
                  min={isFree ? "0" : "1"}
                  {...field} 
                  disabled={isFree}
                  onChange={(e) => {
                    const value = e.target.value;
                    const numValue = parseInt(value);
                    if (!isFree) {
                      if (value === "" || isNaN(numValue)) {
                        field.onChange("1");
                      } else if (numValue < 1) {
                        field.onChange("1");
                      } else {
                        field.onChange(value);
                      }
                    } else {
                      field.onChange("0");
                    }
                  }}
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
