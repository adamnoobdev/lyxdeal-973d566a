
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
  
  useEffect(() => {
    // When the field changes value, trigger validation on related fields
    const subscription = form.watch((value, { name }) => {
      if (name === 'requires_discount_code') {
        console.log("RequiresDiscountCodeField - requires_discount_code changed to:", value.requires_discount_code);
        
        // If switching to direct booking, validate booking_url
        if (value.requires_discount_code === false) {
          console.log("RequiresDiscountCodeField - triggering booking_url validation");
          form.trigger('booking_url');
        }
      }
    });
    
    return () => subscription.unsubscribe();
  }, [form]);
  
  // If this is a disabled field (due to basic plan), make sure booking_url is triggered for validation
  useEffect(() => {
    if (readOnly && !requiresDiscountCode) {
      console.log("RequiresDiscountCodeField - triggering booking_url validation (readOnly mode)");
      form.trigger('booking_url');
    }
    
    // For basic plan users, always ensure the value is set to false
    if (readOnly) {
      console.log("ReadOnly mode detected (isBasicPlan or locked editing) - ensuring requires_discount_code is false");
      form.setValue('requires_discount_code', false, { shouldValidate: true });
      
      // Instead of using nonexistent disable method, we'll just rely on the disabled prop in the UI
      // and prevent changes in the onCheckedChange handler
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
              {readOnly && (
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <LockIcon className="h-4 w-4 text-amber-500" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p className="max-w-xs text-sm">
                        {!field.value 
                          ? "Baspaketet inkluderar inte rabattkoder. Uppgradera till Premiumpaket för att få tillgång till rabattkoder."
                          : "Det går inte att ändra ett erbjudande från att använda rabattkoder till att inte använda dem."
                        }
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
                console.log("Switch toggled to:", checked);
                
                // För basic plan, blockera alla försök att ändra till true
                if (readOnly) {
                  console.log("Switch är låst, ignorerar ändring");
                  // Force it back to false if someone tries to manipulate it
                  setTimeout(() => form.setValue('requires_discount_code', false), 0);
                  return;
                }
                
                // Endast tillåt ändring för premium-användare
                field.onChange(checked);
                
                // If switching to direct booking, trigger booking_url validation immediately
                if (!checked) {
                  console.log("Switched to direct booking - triggering booking_url validation");
                  setTimeout(() => form.trigger('booking_url'), 0);
                }
              }}
              className={readOnly ? "opacity-50 cursor-not-allowed" : ""}
            />
          </FormControl>
        </FormItem>
      )}
    />
  );
};
