
import { FormField, FormItem, FormControl, FormDescription } from "@/components/ui/form";
import { Checkbox } from "@/components/ui/checkbox";
import { UseFormReturn } from "react-hook-form";
import { Label } from "@/components/ui/label";
import { useEffect } from "react";

interface SubscriptionFieldProps {
  form: UseFormReturn<any>;
}

export const SubscriptionField = ({ form }: SubscriptionFieldProps) => {
  // Watch skipSubscription to react to changes
  const skipSubscription = form.watch("skipSubscription");
  const subscriptionPlan = form.watch("subscriptionPlan");
  
  // Ensure that when skipSubscription is toggled, we still maintain a valid subscription plan
  useEffect(() => {
    // If no subscription plan is set, default to Baspaket
    // This is critical for admin-created salons to have proper plan restrictions
    if (!subscriptionPlan) {
      console.log("Setting default subscription plan to Baspaket");
      form.setValue("subscriptionPlan", "Baspaket");
    }
  }, [skipSubscription, subscriptionPlan, form]);

  return (
    <div className="space-y-6">
      <FormField
        control={form.control}
        name="skipSubscription"
        render={({ field }) => (
          <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
            <FormControl>
              <Checkbox
                checked={field.value}
                onCheckedChange={field.onChange}
              />
            </FormControl>
            <div className="space-y-1 leading-none">
              <Label htmlFor="skipSubscription">Aktivera utan betalningskrav för prenumeration</Label>
              <FormDescription>
                Om detta är markerat, kommer salongen att aktiveras utan betalningskrav för prenumeration.
                Använd endast för administrativa salonger eller specialfall.
              </FormDescription>
            </div>
          </FormItem>
        )}
      />

      {skipSubscription && (
        <div className="rounded-md border border-amber-200 bg-amber-50 p-4 text-sm">
          <p className="text-amber-800">
            Salongen kommer att aktiveras <strong>utan betalningskrav</strong> men med vald prenumerationsplan nedan.
            <br />
            <strong>OBS:</strong> Välj prenumerationsplan noggrant eftersom det avgör vilka funktioner salongen får tillgång till.
          </p>
        </div>
      )}
    </div>
  );
};
