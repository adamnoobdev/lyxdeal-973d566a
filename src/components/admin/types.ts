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
  salon_id?: number;
}

export interface Salon {
  id: number;
  name: string;
  email: string;
  phone: string | null;
  address: string | null;
  created_at: string;
  user_id: string | null;
}