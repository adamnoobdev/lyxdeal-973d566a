
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Checkbox } from "@/components/ui/checkbox";
import { Link } from "react-router-dom";
import { UseFormReturn } from "react-hook-form";
import { PartnerFormValues } from "../PartnerFormSchema";

interface TermsAndPrivacyFieldsProps {
  form: UseFormReturn<PartnerFormValues>;
}

export const TermsAndPrivacyFields = ({ form }: TermsAndPrivacyFieldsProps) => {
  return (
    <div className="space-y-4">
      <FormField
        control={form.control}
        name="termsAccepted"
        render={({ field }) => (
          <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
            <FormControl>
              <Checkbox
                checked={field.value}
                onCheckedChange={field.onChange}
              />
            </FormControl>
            <div className="space-y-1 leading-none">
              <FormLabel className="text-sm font-medium leading-none">
                Jag accepterar <Link to="/terms" className="text-primary hover:underline" target="_blank">allmänna villkor</Link> *
              </FormLabel>
              <FormMessage />
            </div>
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="privacyAccepted"
        render={({ field }) => (
          <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
            <FormControl>
              <Checkbox
                checked={field.value}
                onCheckedChange={field.onChange}
              />
            </FormControl>
            <div className="space-y-1 leading-none">
              <FormLabel className="text-sm font-medium leading-none">
                Jag accepterar <Link to="/privacy" className="text-primary hover:underline" target="_blank">integritetspolicy</Link> *
              </FormLabel>
              <FormMessage />
            </div>
          </FormItem>
        )}
      />
    </div>
  );
};
