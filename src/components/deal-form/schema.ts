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
  originalPrice: z.string().refine((val) => !isNaN(Number(val)) && Number(val) > 0, {
    message: "Vänligen ange ett giltigt pris.",
  }),
  discountedPrice: z.string().refine((val) => !isNaN(Number(val)) && Number(val) > 0, {
    message: "Vänligen ange ett giltigt rabatterat pris.",
  }),
  category: z.string().min(1, {
    message: "Vänligen välj en kategori.",
  }),
  city: z.string().min(1, {
    message: "Vänligen ange en stad.",
  }),
  timeRemaining: z.string().min(1, {
    message: "Vänligen ange hur länge erbjudandet gäller.",
  }),
  featured: z.boolean().default(false),
  salon_id: z.number({
    required_error: "Vänligen välj en salong",
    invalid_type_error: "Vänligen välj en salong",
  }),
  quantity: z.string().refine((val) => !isNaN(Number(val)) && Number(val) > 0, {
    message: "Vänligen ange hur många erbjudanden som ska kunna säljas.",
  }),
});

export type FormValues = z.infer<typeof formSchema>;