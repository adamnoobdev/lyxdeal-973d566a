
// Befintliga importeringar behålls
import { Deal } from "@/types/deal";

export type { Deal }; // Export Deal så att andra filer kan importera den från denna fil

// Add new field for explicit subscription data in Salon type
export interface Salon {
  id: number;
  name: string;
  email: string;
  phone: string | null;
  address: string | null;
  created_at: string;
  user_id: string | null;
  role: string;
  terms_accepted: boolean;
  privacy_accepted: boolean;
  rating: number | null;
  rating_comment: string | null;
  subscription_plan?: string; 
  subscription_type?: string;
  skip_subscription?: boolean; // Add skip_subscription field
}

// Make subscription fields required in the form values
export interface SalonFormValues {
  name: string;
  email: string;
  phone: string;
  address: string;
  termsAccepted: boolean;
  privacyAccepted: boolean;
  subscriptionPlan: string;
  subscriptionType: string;
  skipSubscription: boolean; // Make skipSubscription required
}

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
