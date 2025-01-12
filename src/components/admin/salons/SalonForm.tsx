import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { BasicInfoFields } from "./form/BasicInfoFields";
import { ContactFields } from "./form/ContactFields";

const formSchema = z.object({
  name: z.string().min(2, {
    message: "Namnet måste vara minst 2 tecken.",
  }),
  email: z.string().email({
    message: "Vänligen ange en giltig e-postadress.",
  }),
  phone: z.string().optional(),
  address: z.string().optional(),
});

interface SalonFormProps {
  onSubmit: (values: z.infer<typeof formSchema>) => Promise<void>;
  initialValues?: z.infer<typeof formSchema>;
}

export const SalonForm = ({ onSubmit, initialValues }: SalonFormProps) => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: initialValues || {
      name: "",
      email: "",
      phone: "",
      address: "",
    },
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <BasicInfoFields form={form} />
        <ContactFields form={form} />
        
        <div className="flex justify-end gap-4">
          <Button type="submit">Spara</Button>
        </div>
      </form>
    </Form>
  );
};