
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ImageUpload } from "../ImageUpload";
import { UseFormReturn } from "react-hook-form";
import * as z from "zod";
import { formSchema } from "./schema";

interface FormFieldsProps {
  form: UseFormReturn<z.infer<typeof formSchema>>;
  handleImageSelected: (imageUrl: string) => void;
  initialImageUrl?: string;
  disableDiscountCodeField?: boolean;
  forceDirectBooking?: boolean;
}

export const FormFields = ({ 
  form, 
  handleImageSelected, 
  initialImageUrl,
  disableDiscountCodeField,
  forceDirectBooking
}: FormFieldsProps) => {
  return (
    <>
      <FormField
        control={form.control}
        name="title"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Titel</FormLabel>
            <FormControl>
              <Input placeholder="Ange titel..." {...field} className="h-9" />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="description"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Beskrivning</FormLabel>
            <FormControl>
              <Textarea placeholder="Ange beskrivning..." {...field} className="min-h-[5rem]" />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="imageUrl"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Bild</FormLabel>
            <FormControl>
              <ImageUpload 
                onImageSelected={(imageUrl) => {
                  handleImageSelected(imageUrl);
                  field.onChange(imageUrl);
                }} 
                currentImageUrl={initialImageUrl || field.value}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </>
  );
};
