
import * as z from "zod";

export const profileSchema = z.object({
  name: z.string().min(2, "Namnet måste vara minst 2 tecken"),
  email: z.string().email("Ogiltig e-postadress"),
  phone: z.string().optional(),
  fullAddress: z.string().optional(),
  street: z.string().optional(),
  postalCode: z.string().optional(),
  city: z.string().optional(),
  address: z.string().optional(),
  password: z.string().min(6, "Lösenordet måste vara minst 6 tecken").optional(),
});

export type ProfileFormValues = z.infer<typeof profileSchema>;
