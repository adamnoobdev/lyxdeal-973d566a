
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { UseFormReturn } from "react-hook-form";
import * as z from "zod";
import { formSchema } from "./schema";

interface PriceFieldsProps {
  form: UseFormReturn<z.infer<typeof formSchema>>;
}

export const PriceFields = ({ form }: PriceFieldsProps) => {
  return (
    <>
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
              <FormLabel>Rabatterat pris (SEK) - Ange 0 för gratis</FormLabel>
              <FormControl>
                <Input 
                  type="number" 
                  placeholder="500" 
                  {...field} 
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      <FormField
        control={form.control}
        name="is_free"
        render={({ field }) => (
          <input 
            type="hidden" 
            value={field.value ? "true" : "false"} 
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
