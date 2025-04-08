
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormDescription,
  FormMessage,
} from "@/components/ui/form";
import { Switch } from "@/components/ui/switch";
import { UseFormReturn, useWatch } from "react-hook-form";
import { FormValues } from "./schema";
import { useEffect } from "react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Info, LockIcon } from "lucide-react";

interface RequiresDiscountCodeFieldProps {
  form: UseFormReturn<FormValues>;
  readOnly?: boolean;
}

export const RequiresDiscountCodeField = ({ form, readOnly = false }: RequiresDiscountCodeFieldProps) => {
  const requiresDiscountCode = useWatch({
    control: form.control,
    name: "requires_discount_code",
    defaultValue: false
  });
  
  // Get isBasicPlan from the parent component via form context or props if available
  // In this case, we're using a combination of the form's disabled state and readOnly prop
  const isBasicPlan = readOnly || form.getValues('requires_discount_code') === false;
  
  useEffect(() => {
    // If this is a disabled field (due to basic plan), make sure booking_url is triggered for validation
    if (readOnly && !requiresDiscountCode) {
      console.log("RequiresDiscountCodeField - triggering booking_url validation");
      form.trigger('booking_url');
    }
  }, [readOnly, requiresDiscountCode, form]);
  
  return (
    <FormField
      control={form.control}
      name="requires_discount_code"
      render={({ field }) => (
        <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
          <div className="space-y-0.5">
            <div className="flex items-center gap-2">
              <FormLabel className="text-base">Kräver rabattkod</FormLabel>
              {readOnly && !field.value && (
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <LockIcon className="h-4 w-4 text-amber-500" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p className="max-w-xs text-sm">
                        Baspaketet inkluderar inte rabattkoder. Uppgradera till Premiumpaket för att få tillgång till rabattkoder.
                      </p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              )}
              {readOnly && field.value && (
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Info className="h-4 w-4 text-muted-foreground" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p className="max-w-xs text-sm">
                        Det går inte att ändra ett erbjudande från att använda rabattkoder till att inte använda dem.
                        Detta för att undvika problem med redan genererade koder.
                      </p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              )}
            </div>
            <FormDescription>
              {readOnly && !field.value 
                ? "Baspaketet inkluderar endast direkt bokning utan rabattkoder."
                : field.value 
                  ? "Erbjudandet kommer att generera rabattkoder för dina kunder." 
                  : "Erbjudandet kommer inte att använda rabattkoder. Kunder länkas direkt till din bokningssida."
              }
            </FormDescription>
            {readOnly && (
              <FormMessage className="mt-2">
                {field.value 
                  ? "Det går inte att ändra detta val efter att erbjudandet skapats."
                  : "Uppgradera till Premiumpaket för att få tillgång till rabattkoder."
                }
              </FormMessage>
            )}
          </div>
          <FormControl>
            <Switch
              checked={field.value}
              disabled={readOnly}
              onCheckedChange={(checked) => {
                field.onChange(checked);
                // If switching to direct booking, trigger booking_url validation
                if (!checked) {
                  console.log("Switched to direct booking - triggering booking_url validation");
                  form.trigger('booking_url');
                }
              }}
              className={readOnly && !field.value ? "opacity-50 cursor-not-allowed" : ""}
            />
          </FormControl>
        </FormItem>
      )}
    />
  );
};
