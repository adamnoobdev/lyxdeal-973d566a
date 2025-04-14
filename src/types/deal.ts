
export interface Deal {
  id: number;
  title: string;
  description: string;
  image_url: string;
  original_price: number;
  discounted_price: number;
  time_remaining: string;
  expiration_date: string;
  category: string;
  city: string;
  featured: boolean;
  created_at: string;
  updated_at: string;
  quantity_left: number;
  stripe_price_id?: string;
  salon_id?: number;
  status: 'pending' | 'approved' | 'rejected';
  salons?: {
    name?: string;
    rating?: number | null;
  };
  is_free: boolean;
  is_active: boolean;
  booking_url?: string;
  requires_discount_code?: boolean;
  salon_rating?: number;
  rejection_message?: string;
}

export type DealFormData = {
  title: string;
  description: string;
  imageUrl: string;
  originalPrice: string;
  discountedPrice: string;
  category: string;
  city: string;
  expirationDate?: Date | string;
  featured: boolean;
  salon_id?: number;
  is_free: boolean;
  is_active?: boolean;
  quantity?: string;
  booking_url?: string;
  requires_discount_code?: boolean;
  status?: 'pending' | 'approved' | 'rejected';
}
