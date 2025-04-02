
import { FormField, FormItem, FormLabel, FormControl, FormMessage, FormDescription } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { UseFormReturn, useWatch } from "react-hook-form";
import * as z from "zod";
import { formSchema } from "./schema";

interface BookingUrlFieldProps {
  form: UseFormReturn<z.infer<typeof formSchema>>;
}

export const BookingUrlField = ({ form }: BookingUrlFieldProps) => {
  const requiresDiscountCode = useWatch({
    control: form.control,
    name: "requires_discount_code",
    defaultValue: false
  });
  
  const description = requiresDiscountCode
    ? "Lägg till en länk där kunderna kan boka denna behandling. Länken kommer att inkluderas i e-postmeddelandet med rabattkoden."
    : "Kunderna kommer att skickas direkt till denna bokningslänk för att slutföra sin bokning.";
  
  return (
    <FormField
      control={form.control}
      name="booking_url"
      render={({ field }) => (
        <FormItem>
          <FormLabel className="font-semibold">
            Bokningslänk (obligatoriskt)
          </FormLabel>
          <FormControl>
            <Input 
              placeholder="https://www.dinsalong.se/boka" 
              {...field} 
              value={field.value || ''}
              className="border-primary focus-visible:ring-primary"
            />
          </FormControl>
          <FormDescription>
            {description}
          </FormDescription>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};
