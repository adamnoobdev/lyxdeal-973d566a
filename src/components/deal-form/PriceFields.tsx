
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { UseFormReturn } from "react-hook-form";
import * as z from "zod";
import { formSchema } from "./schema";
import { useEffect } from "react";

interface PriceFieldsProps {
  form: UseFormReturn<z.infer<typeof formSchema>>;
}

export const PriceFields = ({ form }: PriceFieldsProps) => {
  // Alla erbjudanden är alltid gratis nu
  useEffect(() => {
    // Sätt is_free till true för alla erbjudanden
    form.setValue("is_free", true);
    // Sätt discountedPrice till 0 för visning (i databasen sparas 1)
    form.setValue("discountedPrice", "0");
  }, [form]);

  return (
    <>
      <div className="p-4 bg-green-50 border border-green-200 rounded-md mb-4">
        <p className="text-green-700 text-sm">
          Alla erbjudanden är nu gratis. Betalning sker direkt hos salongen.
        </p>
      </div>

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
              <FormLabel>Rabatterat pris</FormLabel>
              <FormControl>
                <Input 
                  type="number" 
                  value="0"
                  disabled={true}
                  readOnly={true}
                />
              </FormControl>
              <p className="text-sm text-muted-foreground">Alla erbjudanden är gratis</p>
            </FormItem>
          )}
        />
      </div>

      {/* Dold is_free field som alltid är true */}
      <FormField
        control={form.control}
        name="is_free"
        render={({ field }) => (
          <input 
            type="hidden" 
            value="true" 
            name={field.name}
            ref={field.ref}
            onBlur={field.onBlur}
            onChange={field.onChange}
          />
        )}
      />
    </>
  );
};
