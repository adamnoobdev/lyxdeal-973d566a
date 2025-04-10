
import { FormField, FormItem, FormControl, FormDescription } from "@/components/ui/form";
import { Checkbox } from "@/components/ui/checkbox";
import { UseFormReturn } from "react-hook-form";
import { Label } from "@/components/ui/label";
import { useEffect, useState } from "react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { SUBSCRIPTION_PLANS } from "@/components/salon/subscription/types";

interface SubscriptionFieldProps {
  form: UseFormReturn<any>;
}

export const SubscriptionField = ({ form }: SubscriptionFieldProps) => {
  // Watch skipSubscription to react to changes
  const skipSubscription = form.watch("skipSubscription");
  const subscriptionPlan = form.watch("subscriptionPlan");
  const subscriptionType = form.watch("subscriptionType");
  const [initialLoad, setInitialLoad] = useState(true);
  
  // Ensure that when skipSubscription is toggled, we still maintain valid subscription values
  useEffect(() => {
    // Första gången laddar vi bara värdena
    if (initialLoad) {
      setInitialLoad(false);
      return;
    }
    
    // Always ensure valid subscription values regardless of skipSubscription
    // This is critical for admin-created salons to have proper plan restrictions
    if (!subscriptionPlan) {
      console.log("SubscriptionField: Setting default subscription plan to Baspaket");
      form.setValue("subscriptionPlan", "Baspaket", { shouldValidate: true, shouldDirty: true });
    }
    
    if (!subscriptionType) {
      console.log("SubscriptionField: Setting default subscription type to monthly");
      form.setValue("subscriptionType", "monthly", { shouldValidate: true, shouldDirty: true });
    }
    
    // Additional debugging to track values
    console.log("SubscriptionField effect running with values:", {
      skipSubscription,
      plan: subscriptionPlan || "Not set (will default to Baspaket)",
      type: subscriptionType || "Not set (will default to monthly)"
    });
  }, [skipSubscription, subscriptionPlan, subscriptionType, form, initialLoad]);

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
                onCheckedChange={(checked) => {
                  console.log("Skip subscription checkbox changed to:", checked);
                  
                  // När vi aktiverar/inaktiverar skipSubscription, se till att formuläret markeras som ändrat
                  form.setValue("skipSubscription", !!checked, { shouldDirty: true });
                  
                  // Mark fields as dirty using the proper method
                  const formState = form.getValues();
                  form.setValue("skipSubscription", !!checked, { shouldDirty: true });
                  form.setValue("subscriptionPlan", formState.subscriptionPlan || "Baspaket", { shouldDirty: true });
                  form.setValue("subscriptionType", formState.subscriptionType || "monthly", { shouldDirty: true });
                  
                  console.log("Form field state after click:", form.formState.dirtyFields);
                }}
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

      {/* Add subscription plan field that's always visible */}
      <FormField
        control={form.control}
        name="subscriptionPlan"
        render={({ field }) => (
          <FormItem>
            <Label className="text-sm font-medium">Prenumerationsplan</Label>
            <Select 
              onValueChange={(value) => {
                console.log("Subscription plan selected:", value);
                // Mark as changed to ensure it's saved
                form.setValue("subscriptionPlan", value, { shouldValidate: true, shouldDirty: true });
              }} 
              value={field.value || "Baspaket"}
              defaultValue="Baspaket"
            >
              <FormControl>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Välj plan" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                {Object.keys(SUBSCRIPTION_PLANS).map((planKey) => (
                  <SelectItem key={planKey} value={planKey}>
                    {SUBSCRIPTION_PLANS[planKey].title}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <FormDescription className="text-xs">
              Välj vilken prenumerationsplan salongen ska ha
            </FormDescription>
          </FormItem>
        )}
      />

      {/* Only show the subscription type if skipSubscription is false */}
      {!skipSubscription && (
        <FormField
          control={form.control}
          name="subscriptionType"
          render={({ field }) => (
            <FormItem>
              <Label className="text-sm font-medium">Betalningsintervall</Label>
              <Select 
                onValueChange={(value) => {
                  console.log("Subscription type selected:", value);
                  // Mark as changed to ensure it's saved
                  form.setValue("subscriptionType", value, { shouldValidate: true, shouldDirty: true });
                }} 
                value={field.value || "monthly"}
                defaultValue="monthly"
              >
                <FormControl>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Välj intervall" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="monthly">Månadsvis</SelectItem>
                  <SelectItem value="yearly">Årsvis</SelectItem>
                </SelectContent>
              </Select>
              <FormDescription className="text-xs">
                Välj faktureringsintervall för prenumerationen
              </FormDescription>
            </FormItem>
          )}
        />
      )}

      {skipSubscription && (
        <Alert variant="default" className="bg-blue-50 border-blue-200">
          <AlertCircle className="h-4 w-4 text-blue-500" />
          <AlertDescription className="text-blue-700">
            För administrativt skapade salonger är betalningsintervall inte relevant, 
            eftersom inga betalningsuppgifter finns och prenumerationen inte har något slutdatum.
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
};
