
import { FormField, FormItem, FormControl, FormDescription } from "@/components/ui/form";
import { Checkbox } from "@/components/ui/checkbox";
import { UseFormReturn } from "react-hook-form";
import { Label } from "@/components/ui/label";

interface SubscriptionFieldProps {
  form: UseFormReturn<any>;
}

export const SubscriptionField = ({ form }: SubscriptionFieldProps) => {
  return (
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
            <Label htmlFor="skipSubscription">Aktivera utan prenumeration</Label>
            <FormDescription>
              Om detta är markerat, kommer salongen att aktiveras utan betalning eller prenumeration.
              Använd endast för administrativa salonger eller specialfall.
            </FormDescription>
          </div>
        </FormItem>
      )}
    />
  );
};
