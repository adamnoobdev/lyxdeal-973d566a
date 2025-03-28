
import { FormField, FormItem, FormLabel, FormControl, FormMessage, FormDescription } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { UseFormReturn } from "react-hook-form";
import * as z from "zod";
import { formSchema } from "./schema";

interface BookingUrlFieldProps {
  form: UseFormReturn<z.infer<typeof formSchema>>;
}

export const BookingUrlField = ({ form }: BookingUrlFieldProps) => {
  return (
    <FormField
      control={form.control}
      name="booking_url"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Bokningslänk (valfritt)</FormLabel>
          <FormControl>
            <Input 
              placeholder="https://www.dinsalong.se/boka" 
              {...field} 
              value={field.value || ''}
            />
          </FormControl>
          <FormDescription>
            Lägg till en länk där kunderna kan boka denna behandling. Länken kommer att inkluderas i e-postmeddelandet med rabattkoden.
          </FormDescription>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};
