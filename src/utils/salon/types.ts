
import { Salon } from "@/components/admin/types";

// Export the default salon data type
export interface SalonData {
  id: number | null;
  name: string;
  address: string | null;
  phone: string | null;
  email?: string;
  created_at?: string;
  user_id?: string | null;
  role?: string;
  terms_accepted?: boolean;
  privacy_accepted?: boolean;
  rating?: number | null;
  rating_comment?: string | null;
}

// Re-export relevant types for backward compatibility
export { createDefaultSalonData } from "@/utils/salon/salonDataUtils";
