
import { FormField, FormItem, FormLabel, FormControl, FormMessage, FormDescription } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { UseFormReturn, useWatch } from "react-hook-form";
import * as z from "zod";
import { formSchema } from "./schema";
import { useMemo } from "react";

interface BookingUrlFieldProps {
  form: UseFormReturn<z.infer<typeof formSchema>>;
}

export const BookingUrlField = ({ form }: BookingUrlFieldProps) => {
  const requiresDiscountCode = useWatch({
    control: form.control,
    name: "requires_discount_code",
    defaultValue: true
  });
  
  const description = useMemo(() => {
    if (requiresDiscountCode) {
      return "Lägg till en länk där kunderna kan boka denna behandling. Länken kommer att inkluderas i e-postmeddelandet med rabattkoden.";
    } else {
      return "En bokningslänk är OBLIGATORISK när erbjudandet inte använder rabattkoder. Kunderna kommer att skickas direkt till denna länk.";
    }
  }, [requiresDiscountCode]);
  
  return (
    <FormField
      control={form.control}
      name="booking_url"
      render={({ field }) => (
        <FormItem>
          <FormLabel className={!requiresDiscountCode ? "font-semibold text-primary" : ""}>
            {!requiresDiscountCode ? "Bokningslänk (obligatoriskt)" : "Bokningslänk (valfritt)"}
          </FormLabel>
          <FormControl>
            <Input 
              placeholder="https://www.dinsalong.se/boka" 
              {...field} 
              value={field.value || ''}
              className={!requiresDiscountCode ? "border-primary focus-visible:ring-primary" : ""}
            />
          </FormControl>
          <FormDescription className={!requiresDiscountCode ? "text-primary-600 font-medium" : ""}>
            {description}
          </FormDescription>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};
