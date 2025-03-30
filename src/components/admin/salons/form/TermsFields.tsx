
import { FormField, FormItem, FormControl, FormDescription } from "@/components/ui/form";
import { Checkbox } from "@/components/ui/checkbox";
import { UseFormReturn } from "react-hook-form";
import { Label } from "@/components/ui/label";

interface TermsFieldsProps {
  form: UseFormReturn<any>;
}

export const TermsFields = ({ form }: TermsFieldsProps) => {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium">Godkännanden</h3>
      <div className="grid gap-4">
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
                <Label htmlFor="termsAccepted">Godkänt allmänna villkor</Label>
                <FormDescription>
                  Markera om salongen har godkänt allmänna villkor.
                </FormDescription>
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
                <Label htmlFor="privacyAccepted">Godkänt integritetspolicy</Label>
                <FormDescription>
                  Markera om salongen har godkänt integritetspolicyn.
                </FormDescription>
              </div>
            </FormItem>
          )}
        />
      </div>
    </div>
  );
};
