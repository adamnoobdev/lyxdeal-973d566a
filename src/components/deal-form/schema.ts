
import * as z from "zod";

export const formSchema = z.object({
  title: z.string().min(2, {
    message: "Titeln måste vara minst 2 tecken.",
  }),
  description: z.string().min(10, {
    message: "Beskrivningen måste vara minst 10 tecken.",
  }),
  imageUrl: z.string().min(1, {
    message: "En bild måste laddas upp.",
  }),
  originalPrice: z.string().refine((val) => {
    // Ensure it's convertible to a number and >= 1 to satisfy DB constraint
    const num = Number(val);
    return !isNaN(num) && num >= 1;
  }, {
    message: "Vänligen ange ett giltigt pris (minst 1 kr).",
  }),
  discountedPrice: z.string().refine((val) => {
    // Also ensure it's >= 1 for non-free deals to satisfy DB constraint
    const num = Number(val);
    return !isNaN(num) && num >= 0;
  }, {
    message: "Vänligen ange ett giltigt rabatterat pris.",
  }),
  category: z.string().min(1, {
    message: "Vänligen välj en kategori.",
  }),
  city: z.string().min(1, {
    message: "Vänligen ange en stad.",
  }),
  expirationDate: z.date({
    required_error: "Vänligen välj ett slutdatum.",
  }),
  featured: z.boolean().default(false),
  salon_id: z.number({
    required_error: "Vänligen välj en salong",
    invalid_type_error: "Vänligen välj en salong",
  }),
  quantity: z.string().refine((val) => !isNaN(Number(val)) && Number(val) > 0, {
    message: "Vänligen ange hur många erbjudanden som ska kunna säljas.",
  }),
  is_free: z.boolean().default(false),
  is_active: z.boolean().default(true),
});

export type FormValues = z.infer<typeof formSchema>;
