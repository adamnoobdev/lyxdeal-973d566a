
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
import { Info, AlertTriangle } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useSession } from "@/hooks/useSession";

interface RequiresDiscountCodeFieldProps {
  form: UseFormReturn<FormValues>;
  readOnly?: boolean;
}

export const RequiresDiscountCodeField = ({ form, readOnly = false }: RequiresDiscountCodeFieldProps) => {
  const { session } = useSession();
  const requiresDiscountCode = useWatch({
    control: form.control,
    name: "requires_discount_code",
    defaultValue: false
  });
  
  // Fetch the salon subscription plan
  const { data: salonData } = useQuery({
    queryKey: ['salon-subscription', session?.user.id],
    queryFn: async () => {
      if (!session?.user.id) return null;
      
      const { data, error } = await supabase
        .from('salons')
        .select('subscription_plan')
        .eq('user_id', session.user.id)
        .single();

      if (error) {
        console.error('Error fetching salon subscription:', error);
        return null;
      }
      
      return data;
    },
    enabled: !!session?.user.id,
  });
  
  // Determine if the salon has the basic package (no discount codes allowed)
  const hasBasicPackage = salonData?.subscription_plan === 'Baspaket';
  
  // Force discount code setting based on subscription plan
  useEffect(() => {
    if (hasBasicPackage && requiresDiscountCode) {
      form.setValue("requires_discount_code", false);
    }
  }, [hasBasicPackage, requiresDiscountCode, form]);
  
  const isDisabled = readOnly || hasBasicPackage;
  
  return (
    <FormField
      control={form.control}
      name="requires_discount_code"
      render={({ field }) => (
        <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
          <div className="space-y-0.5">
            <div className="flex items-center gap-2">
              <FormLabel className="text-base">Kräver rabattkod</FormLabel>
              {hasBasicPackage && (
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <AlertTriangle className="h-4 w-4 text-amber-500" />
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
              {hasBasicPackage 
                ? "Baspaketet inkluderar endast direkt bokning utan rabattkoder."
                : field.value 
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
              disabled={isDisabled}
              onCheckedChange={field.onChange}
            />
          </FormControl>
        </FormItem>
      )}
    />
  );
};
