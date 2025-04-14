
import { FormField, FormItem, FormControl, FormDescription } from "@/components/ui/form";
import { Checkbox } from "@/components/ui/checkbox";
import { UseFormReturn } from "react-hook-form";
import { Label } from "@/components/ui/label";
import { useEffect, useState } from "react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle, Calendar as CalendarIcon } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { SUBSCRIPTION_PLANS } from "@/components/salon/subscription/types";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";
import { format } from "date-fns";

interface SubscriptionFieldProps {
  form: UseFormReturn<any>;
}

export const SubscriptionField = ({ form }: SubscriptionFieldProps) => {
  const skipSubscription = form.watch("skipSubscription");
  const subscriptionPlan = form.watch("subscriptionPlan");
  const subscriptionType = form.watch("subscriptionType");
  const subscriptionEndDate = form.watch("subscriptionEndDate");
  const [initialLoad, setInitialLoad] = useState(true);
  
  useEffect(() => {
    if (initialLoad) {
      setInitialLoad(false);
      return;
    }
    
    if (!subscriptionPlan) {
      console.log("SubscriptionField: Setting default subscription plan to Baspaket");
      form.setValue("subscriptionPlan", "Baspaket", { shouldValidate: true, shouldDirty: true });
    }
    
    if (!subscriptionType) {
      console.log("SubscriptionField: Setting default subscription type to monthly");
      form.setValue("subscriptionType", "monthly", { shouldValidate: true, shouldDirty: true });
    }
    
    // Om skipSubscription är true och det inte finns något slutdatum, sätt ett standardslutdatum
    if (skipSubscription && !subscriptionEndDate) {
      // Sätt standardslutdatum till ett år från idag
      const defaultEndDate = new Date();
      defaultEndDate.setFullYear(defaultEndDate.getFullYear() + 1);
      form.setValue("subscriptionEndDate", defaultEndDate, { shouldValidate: true, shouldDirty: true });
    }
    
    console.log("SubscriptionField effect running with values:", {
      skipSubscription,
      plan: subscriptionPlan || "Not set (will default to Baspaket)",
      type: subscriptionType || "Not set (will default to monthly)",
      endDate: subscriptionEndDate || "Not set"
    });
  }, [skipSubscription, subscriptionPlan, subscriptionType, subscriptionEndDate, form, initialLoad]);

  return (
    <div className="space-y-5 w-full">
      <FormField
        control={form.control}
        name="skipSubscription"
        render={({ field }) => (
          <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4 w-full">
            <FormControl>
              <Checkbox
                checked={field.value}
                onCheckedChange={(checked) => {
                  console.log("Skip subscription checkbox changed to:", checked);
                  
                  form.setValue("skipSubscription", !!checked, { shouldDirty: true });
                  
                  const formValues = form.getValues();
                  form.setValue("subscriptionPlan", formValues.subscriptionPlan || "Baspaket", { shouldDirty: true });
                  form.setValue("subscriptionType", formValues.subscriptionType || "monthly", { shouldDirty: true });
                  
                  // Om skipSubscription är aktiverad, sätt ett standardslutdatum
                  if (checked) {
                    const defaultEndDate = new Date();
                    defaultEndDate.setFullYear(defaultEndDate.getFullYear() + 1);
                    form.setValue("subscriptionEndDate", defaultEndDate, { shouldDirty: true });
                  }
                }}
              />
            </FormControl>
            <div className="space-y-1 leading-none max-w-full">
              <Label htmlFor="skipSubscription" className="text-sm">Aktivera utan betalningskrav för prenumeration</Label>
              <FormDescription className="text-xs">
                Om detta är markerat, kommer salongen att aktiveras utan betalningskrav för prenumeration.
                Använd endast för administrativa salonger eller specialfall.
              </FormDescription>
            </div>
          </FormItem>
        )}
      />

      {skipSubscription && (
        <div className="rounded-md border border-amber-200 bg-amber-50 p-4 text-sm w-full">
          <p className="text-amber-800 text-sm">
            Salongen kommer att aktiveras <strong>utan betalningskrav</strong> men med vald prenumerationsplan nedan.
            <br />
            <strong>OBS:</strong> Välj prenumerationsplan noggrant eftersom det avgör vilka funktioner salongen får tillgång till.
          </p>
        </div>
      )}

      <FormField
        control={form.control}
        name="subscriptionPlan"
        render={({ field }) => (
          <FormItem className="w-full">
            <Label className="text-sm font-medium">Prenumerationsplan</Label>
            <Select 
              onValueChange={(value) => {
                console.log("Subscription plan selected:", value);
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

      {!skipSubscription && (
        <FormField
          control={form.control}
          name="subscriptionType"
          render={({ field }) => (
            <FormItem className="w-full">
              <Label className="text-sm font-medium">Betalningsintervall</Label>
              <Select 
                onValueChange={(value) => {
                  console.log("Subscription type selected:", value);
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
        <FormField
          control={form.control}
          name="subscriptionEndDate"
          render={({ field }) => (
            <FormItem className="w-full">
              <Label className="text-sm font-medium">Slutdatum för prenumeration</Label>
              <div className="flex flex-col">
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-full h-10 px-3 border border-input bg-background text-left font-normal",
                          !field.value && "text-muted-foreground"
                        )}
                      >
                        {field.value ? (
                          format(new Date(field.value), "yyyy-MM-dd")
                        ) : (
                          "Välj ett datum"
                        )}
                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0 z-50" align="start">
                    <Calendar
                      mode="single"
                      selected={field.value ? new Date(field.value) : undefined}
                      onSelect={(date) => {
                        console.log("Subscription end date selected:", date);
                        form.setValue("subscriptionEndDate", date, { shouldDirty: true });
                      }}
                      disabled={(date) => date < new Date()} // Inaktivera datum i det förflutna
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
                <FormDescription className="text-xs mt-1">
                  Välj när prenumerationen ska upphöra. Efter detta datum kommer salongen behöva förnya sin prenumeration.
                </FormDescription>
              </div>
            </FormItem>
          )}
        />
      )}

      {skipSubscription && !form.watch("subscriptionEndDate") && (
        <Alert variant="destructive" className="mb-2">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription className="text-sm">
            Du måste välja ett slutdatum för prenumerationen. 
            Detta datum avgör när salongen behöver förnya sin prenumeration.
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
};
