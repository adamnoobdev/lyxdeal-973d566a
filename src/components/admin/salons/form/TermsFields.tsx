
import { FormField, FormItem, FormLabel, FormControl, FormDescription, FormMessage } from "@/components/ui/form";
import { Checkbox } from "@/components/ui/checkbox";
import { UseFormReturn } from "react-hook-form";

interface TermsFieldsProps {
  form: UseFormReturn<any>;
}

export const TermsFields = ({ form }: TermsFieldsProps) => {
  return (
    <div className="space-y-4">
      <h3 className="text-base sm:text-lg font-medium">Godkännanden</h3>

      <FormField
        control={form.control}
        name="termsAccepted"
        render={({ field }) => (
          <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md p-4 bg-muted/20">
            <FormControl>
              <Checkbox 
                checked={field.value} 
                onCheckedChange={field.onChange} 
              />
            </FormControl>
            <div className="space-y-1 leading-none">
              <FormLabel className="text-sm font-medium">
                Godkänt allmänna villkor
              </FormLabel>
              <FormDescription className="text-xs">
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
          <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md p-4 bg-muted/20">
            <FormControl>
              <Checkbox 
                checked={field.value} 
                onCheckedChange={field.onChange} 
              />
            </FormControl>
            <div className="space-y-1 leading-none">
              <FormLabel className="text-sm font-medium">
                Godkänt integritetspolicy
              </FormLabel>
              <FormDescription className="text-xs">
                Markera om salongen har godkänt integritetspolicyn.
              </FormDescription>
            </div>
          </FormItem>
        )}
      />
    </div>
  );
};
