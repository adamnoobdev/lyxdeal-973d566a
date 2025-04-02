
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
import { Info } from "lucide-react";

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
  
  return (
    <FormField
      control={form.control}
      name="requires_discount_code"
      render={({ field }) => (
        <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
          <div className="space-y-0.5">
            <div className="flex items-center gap-2">
              <FormLabel className="text-base">Kräver rabattkod</FormLabel>
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
              {field.value 
                ? "Erbjudandet kommer att generera rabattkoder för dina kunder." 
                : "Erbjudandet kommer inte att använda rabattkoder. Kunder länkas direkt till din bokningssida."
              }
            </FormDescription>
            {readOnly && field.value && (
              <FormMessage className="mt-2">
                Det går inte att ändra detta val efter att erbjudandet skapats.
              </FormMessage>
            )}
          </div>
          <FormControl>
            <Switch
              checked={field.value}
              disabled={readOnly && field.value}
              onCheckedChange={field.onChange}
            />
          </FormControl>
        </FormItem>
      )}
    />
  );
};
