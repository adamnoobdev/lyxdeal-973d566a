
export interface RawDealData {
  id: number;
  title: string;
  description: string;
  image_url: string;
  original_price: number;
  discounted_price: number;
  time_remaining?: string;
  expiration_date?: string;
  category: string;
  city: string;
  created_at: string;
  updated_at?: string;
  quantity_left: number;
  salon_id?: number;
  is_free?: boolean;
  booking_url?: string;
  requires_discount_code?: boolean;
}

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
    rating?: number | null;
  } | null;
  booking_url: string | null;
  requires_discount_code?: boolean;
  salon_rating?: number | null;
}
