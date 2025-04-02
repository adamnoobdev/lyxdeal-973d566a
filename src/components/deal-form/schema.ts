
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
    // Allow 0 for free deals, but ensure it's convertible to a number
    return !isNaN(Number(val)) && Number(val) >= 0;
  }, {
    message: "Vänligen ange ett giltigt pris.",
  }),
  discountedPrice: z.string().refine((val) => {
    // Allow 0 for free deals, but ensure it's convertible to a number
    return !isNaN(Number(val)) && Number(val) >= 0;
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
    message: "Vänligen ange hur många rabattkoder som ska genereras för detta erbjudande.",
  }),
  is_free: z.boolean().default(false),
  is_active: z.boolean().default(true),
  booking_url: z.string().url({
    message: "Vänligen ange en giltig URL som börjar med http:// eller https://",
  }).optional().or(z.literal('')),
  requires_discount_code: z.boolean().default(false),
});

export type FormValues = z.infer<typeof formSchema>;
