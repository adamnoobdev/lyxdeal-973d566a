
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { BasicInfoFields } from "./form/BasicInfoFields";
import { ContactFields } from "./form/ContactFields";
import { PasswordField } from "./form/PasswordField";
import { SubscriptionField } from "./form/SubscriptionField";
import { Loader2 } from "lucide-react";

const formSchema = z.object({
  name: z.string().min(2, {
    message: "Namnet måste vara minst 2 tecken.",
  }),
  email: z.string().email({
    message: "Vänligen ange en giltig e-postadress.",
  }),
  phone: z.string().optional(),
  address: z.string().optional(),
  password: z.string().optional(),
  skipSubscription: z.boolean().optional().default(false),
});

interface SalonFormProps {
  onSubmit: (values: z.infer<typeof formSchema>) => Promise<void>;
  initialValues?: z.infer<typeof formSchema>;
  isEditing?: boolean;
}

export const SalonForm = ({ onSubmit, initialValues, isEditing }: SalonFormProps) => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: initialValues || {
      name: "",
      email: "",
      phone: "",
      address: "",
      password: "",
      skipSubscription: false,
    },
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <BasicInfoFields form={form} />
        <ContactFields form={form} />
        {isEditing && <PasswordField form={form} />}
        {!isEditing && <SubscriptionField form={form} />}
        
        <div className="flex justify-end gap-4">
          <Button 
            type="submit" 
            disabled={form.formState.isSubmitting}
          >
            {form.formState.isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Sparar...
              </>
            ) : (
              "Spara"
            )}
          </Button>
        </div>
      </form>
    </Form>
  );
};
