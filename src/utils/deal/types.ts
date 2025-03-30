
/**
 * Type definitions for deal operations
 */

import { Database } from "@/integrations/supabase/types";

// Deal information from database
export type Deal = Database['public']['Tables']['deals']['Row'];

// Deal status types
export type DealStatus = 'pending' | 'approved' | 'rejected';

// Deal with possible salon information
export interface DealWithSalon extends Deal {
  salons?: {
    name: string;
    id?: number;
  } | null;
}

// Move content from dealTypes.ts here to provide a single source of truth
/**
 * Raw deal data from the database
 */
export interface RawDealData {
  id: number;
  title: string;
  description: string;
  image_url: string;
  original_price: number;
  discounted_price: number;
  expiration_date?: string | null;
  time_remaining?: string;
  category: string;
  city: string;
  created_at: string;
  quantity_left: number;
  is_free?: boolean | null;
  salon_id?: number | null;
  booking_url?: string | null;
}

/**
 * Formatted deal data for UI consumption
 */
export interface FormattedDealData {
  id: number;
  title: string;
  description: string;
  imageUrl: string;
  originalPrice: number;
  discountedPrice: number;
  daysRemaining: number;
  expirationDate: string;
  category: string;
  city: string;
  created_at: string;
  quantityLeft: number;
  isFree: boolean;
  salon: {
    id: number | null;
    name: string;
    address: string | null;
    phone: string | null;
  };
  booking_url?: string;
}
