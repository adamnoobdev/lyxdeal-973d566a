
import { UserRole } from "@/hooks/useAuth";

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
  subscription_plan?: string | null;
  subscription_type?: string | null;
  skip_subscription?: boolean;
}

export interface SalonFormValues {
  name: string;
  email: string;
  phone: string;
  address?: string;
  fullAddress?: string;
  street?: string;
  postalCode?: string;
  city?: string;
  role?: UserRole;
  password?: string;
  terms_accepted?: boolean;
  privacy_accepted?: boolean;
  termsAccepted?: boolean;
  privacyAccepted?: boolean;
  subscriptionPlan?: string;
  subscriptionType?: string;
  skipSubscription?: boolean;
  subscriptionEndDate?: string;
}

// Updated Deal interface to match src/types/deal.ts requirements
export interface Deal {
  id: number;
  title: string;
  description: string;
  original_price: number;
  discounted_price: number;
  category: string;
  city: string;
  image_url: string;
  time_remaining: string;
  featured: boolean; // Required property
  status: 'pending' | 'approved' | 'rejected'; // Updated to match src/types/deal.ts
  is_active: boolean; // Changed from optional to required to match src/types/deal.ts
  salon_id?: number;
  salon?: {
    name?: string;
  };
  created_at: string; // Required property
  updated_at: string; // Required property
  requires_discount_code?: boolean;
  booking_url?: string;
  expiration_date: string; // Required property
  rejection_message?: string;
  quantity_left: number; // Required property
  is_free: boolean; // Required property
  stripe_price_id?: string;
}
