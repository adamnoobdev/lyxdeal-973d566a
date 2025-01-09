export interface Deal {
  id: number;
  title: string;
  description: string;
  imageUrl: string;
  originalPrice: number;
  discountedPrice: number;
  category: string;
  city: string;
  timeRemaining: string;
  featured: boolean;
  created_at: string;
  updated_at: string;
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
