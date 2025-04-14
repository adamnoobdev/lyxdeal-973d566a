
import { z } from "zod";

export const formSchema = z.object({
  title: z.string().min(1, {
    message: "Titel är obligatoriskt",
  }),
  description: z.string().min(1, {
    message: "Beskrivning är obligatoriskt",
  }),
  imageUrl: z.string().optional(),
  originalPrice: z.string().min(1, {
    message: "Ordinarie pris är obligatoriskt",
  }),
  discountedPrice: z.string().min(1, {
    message: "Rabatterat pris är obligatoriskt",
  }),
  category: z.string().min(1, {
    message: "Kategori är obligatoriskt",
  }),
  city: z.string().min(1, {
    message: "Stad är obligatoriskt",
  }),
  expirationDate: z.date().optional(),
  featured: z.boolean().default(false).optional(),
  salon_id: z.number().optional(),
  is_free: z.boolean().default(false).optional(),
  is_active: z.boolean().default(true).optional(),
  quantity: z.string().optional(),
  booking_url: z.string().optional(),
  requires_discount_code: z.boolean().default(false).optional(),
  status: z.enum(['pending', 'approved', 'rejected']).optional(),
}).refine((data) => {
  // BookingUrl är obligatoriskt när requires_discount_code är false
  if (!data.requires_discount_code && (!data.booking_url || data.booking_url.trim() === "")) {
    return false;
  }
  return true;
}, {
  message: "Bokningslänk är obligatoriskt när du inte använder rabattkoder",
  path: ["booking_url"] // Specify which field this error is attached to
});

// Exportera typen som genereras från schemat
export type FormValues = z.infer<typeof formSchema>;
