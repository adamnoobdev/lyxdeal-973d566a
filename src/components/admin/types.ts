export interface Deal {
  id: number;
  title: string;
  description: string;
  image_url: string;
  original_price: number;
  discounted_price: number;
  category: string;
  city: string;
  time_remaining: string;
  featured: boolean;
  created_at: string;
  updated_at: string;
  quantity_left: number;
  salon_id?: number;
  status: 'pending' | 'approved' | 'rejected';
  salons?: {
    name: string;
  };
  is_free: boolean;
  is_active: boolean;
  expiration_date: string;
  booking_url?: string;
  requires_discount_code?: boolean;
}

export interface Salon {
  id: number;
  name: string;
  email: string;
  phone: string | null;
  address: string | null;
  created_at: string;
  user_id: string | null;
  role: string;
  terms_accepted?: boolean;
  privacy_accepted?: boolean;
}

export interface SalonFormValues {
  name: string;
  email: string;
  phone?: string;
  address?: string;
  password?: string;
  termsAccepted?: boolean;
  privacyAccepted?: boolean;
}
