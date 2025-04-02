
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormDescription,
} from "@/components/ui/form";
import { Switch } from "@/components/ui/switch";
import { UseFormReturn, useWatch } from "react-hook-form";
import { FormValues } from "./schema";
import { useEffect } from "react";

interface RequiresDiscountCodeFieldProps {
  form: UseFormReturn<FormValues>;
}

export const RequiresDiscountCodeField = ({ form }: RequiresDiscountCodeFieldProps) => {
  const requiresDiscountCode = useWatch({
    control: form.control,
    name: "requires_discount_code",
    defaultValue: true
  });
  
  const bookingUrl = useWatch({
    control: form.control,
    name: "booking_url",
    defaultValue: ""
  });
  
  // When turning off discount codes, we need to ensure a booking URL is provided
  useEffect(() => {
    if (!requiresDiscountCode && !bookingUrl) {
      form.setError("booking_url", {
        type: "manual",
        message: "En bokningslänk krävs när erbjudandet inte använder rabattkoder"
      });
    } else if (!requiresDiscountCode && bookingUrl) {
      form.clearErrors("booking_url");
    }
  }, [requiresDiscountCode, bookingUrl, form]);
  
  return (
    <FormField
      control={form.control}
      name="requires_discount_code"
      render={({ field }) => (
        <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
          <div className="space-y-0.5">
            <FormLabel className="text-base">Kräver rabattkod</FormLabel>
            <FormDescription>
              {field.value 
                ? "Erbjudandet kommer att generera rabattkoder för dina kunder." 
                : "Erbjudandet kommer inte att använda rabattkoder. Kunder länkas direkt till din bokningssida."
              }
            </FormDescription>
          </div>
          <FormControl>
            <Switch
              checked={field.value}
              onCheckedChange={(checked) => {
                field.onChange(checked);
                if (!checked) {
                  // Highlight the booking URL field if it's empty
                  if (!form.getValues("booking_url")) {
                    form.setFocus("booking_url");
                  }
                }
              }}
            />
          </FormControl>
        </FormItem>
      )}
    />
  );
};
