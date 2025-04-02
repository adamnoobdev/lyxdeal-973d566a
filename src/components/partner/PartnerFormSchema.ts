
import * as z from "zod";

export const formSchema = z.object({
  name: z.string().min(2, { message: "Namn måste vara minst 2 tecken." }),
  business_name: z.string().min(2, { message: "Företagsnamn måste vara minst 2 tecken." }),
  email: z.string().email({ message: "Ogiltig e-postadress." }),
  phone: z.string().min(6, { message: "Telefonnummer måste vara minst 6 tecken." }),
  address: z.string().min(5, { message: "En fullständig adress krävs." }),
  termsAccepted: z.boolean().refine(val => val === true, {
    message: "Du måste acceptera våra allmänna villkor"
  }),
  privacyAccepted: z.boolean().refine(val => val === true, {
    message: "Du måste acceptera vår integritetspolicy"
  }),
});

export type PartnerFormValues = z.infer<typeof formSchema>;
