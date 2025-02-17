export interface Deal {
  id: number;
  title: string;
  description: string;
  image_url: string;
  original_price: number;
  discounted_price: number;
  time_remaining: string;
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
    name: string;
  };
}

export type DealFormData = {
  title: string;
  description: string;
  imageUrl: string;
  originalPrice: string;
  discountedPrice: string;
  category: string;
  city: string;
  timeRemaining: string;
  featured: boolean;
  salon_id?: number;
}