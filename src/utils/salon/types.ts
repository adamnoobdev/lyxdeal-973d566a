
import { Salon } from "@/components/admin/types";

// Export the default salon data type
export interface SalonData {
  id: number | null;
  name: string;
  address: string | null;
  phone: string | null;
  rating?: number;
}

// Re-export relevant types for backward compatibility
export { createDefaultSalonData } from "@/utils/salon/salonDataUtils";
