
// Befintliga importeringar behålls
import { Deal } from "@/types/deal";

export type { Deal }; // Export Deal så att andra filer kan importera den från denna fil

export interface Salon {
  id: number;
  name: string;
  email?: string;
  phone: string | null;
  address: string | null;
  created_at?: string;
  user_id?: string | null;
  role?: string;
  terms_accepted?: boolean;
  privacy_accepted?: boolean;
  rating?: number;
  rating_comment?: string;
}

// Add SalonFormValues interface that was missing
export interface SalonFormValues {
  name: string;
  email?: string;
  phone?: string;
  address?: string;
  termsAccepted?: boolean;
  privacyAccepted?: boolean;
}

// Resten av filen behålls som den är
export interface CategorizedDeals {
  all: Deal[];
  active: Deal[];
  inactive: Deal[];
  pending: Deal[];
}

export interface DealsTabProps {
  deals: Deal[];
  onEdit: (deal: Deal) => void;
  onDelete: (deal: Deal) => void;
  onToggleActive: (deal: Deal) => void;
  handleViewDiscountCodes: (deal: Deal) => void;
}

export interface DealStats {
  totalDeals: number;
  activeDeals: number;
  pendingDeals: number;
  totalVisits?: number;
  totalSignups?: number;
}
