export interface Deal {
  id: number;
  title: string;
  description: string;
  originalPrice: number;
  discountedPrice: number;
  category: string;
  city: string;
  timeRemaining: string;
  imageUrl: string;
  featured: boolean;
}