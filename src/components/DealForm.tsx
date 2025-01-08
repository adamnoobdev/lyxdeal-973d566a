import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { ImageUpload } from "./ImageUpload";
import { toast } from "sonner";

const formSchema = z.object({
  title: z.string().min(2, {
    message: "Titeln måste vara minst 2 tecken.",
  }),
  description: z.string().min(10, {
    message: "Beskrivningen måste vara minst 10 tecken.",
  }),
  imageUrl: z.string().min(1, {
    message: "En bild måste laddas upp.",
  }),
  originalPrice: z.string().refine((val) => !isNaN(Number(val)) && Number(val) > 0, {
    message: "Vänligen ange ett giltigt pris.",
  }),
  discountedPrice: z.string().refine((val) => !isNaN(Number(val)) && Number(val) > 0, {
    message: "Vänligen ange ett giltigt rabatterat pris.",
  }),
  category: z.string().min(1, {
    message: "Vänligen välj en kategori.",
  }),
  timeRemaining: z.string().min(1, {
    message: "Vänligen ange hur länge erbjudandet gäller.",
  }),
});

interface DealFormProps {
  onSubmit: (values: z.infer<typeof formSchema>) => Promise<void>;
}

export const DealForm = ({ onSubmit }: DealFormProps) => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      description: "",
      imageUrl: "",
      originalPrice: "",
      discountedPrice: "",
      category: "",
      timeRemaining: "",
    },
  });

  const handleImageSelected = (imageUrl: string) => {
    form.setValue("imageUrl", imageUrl);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Titel</FormLabel>
              <FormControl>
                <Input placeholder="Ange titel..." {...field} />
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
                <Textarea placeholder="Ange beskrivning..." {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="imageUrl"
          render={() => (
            <FormItem>
              <FormLabel>Bild</FormLabel>
              <FormControl>
                <ImageUpload onImageSelected={handleImageSelected} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="originalPrice"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Ordinarie pris (SEK)</FormLabel>
                <FormControl>
                  <Input type="number" placeholder="1000" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="discountedPrice"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Rabatterat pris (SEK)</FormLabel>
                <FormControl>
                  <Input type="number" placeholder="750" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="category"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Kategori</FormLabel>
              <FormControl>
                <select
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  {...field}
                >
                  <option value="">Välj kategori...</option>
                  <option value="Skönhet & Spa">Skönhet & Spa</option>
                  <option value="Restauranger">Restauranger</option>
                  <option value="Aktiviteter">Aktiviteter</option>
                  <option value="Resor">Resor</option>
                  <option value="Shopping">Shopping</option>
                </select>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="timeRemaining"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Giltighetstid</FormLabel>
              <FormControl>
                <Input placeholder="t.ex. 2 dagar kvar" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" className="w-full">
          {form.formState.isSubmitting ? "Skapar erbjudande..." : "Skapa erbjudande"}
        </Button>
      </form>
    </Form>
  );
};