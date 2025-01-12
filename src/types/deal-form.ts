import { z } from "zod";
import { formSchema } from "@/components/deal-form/schema";

export type DealFormValues = z.infer<typeof formSchema>;