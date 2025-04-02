
import { z } from "zod";

export const profileSchema = z.object({
  name: z.string().min(1, "Namn krävs"),
  email: z.string().email("Ogiltig e-postadress"),
  phone: z.string().optional(),
  address: z.string().optional(),
});

export type ProfileFormValues = z.infer<typeof profileSchema>;
