
export interface SalonRating {
  id: number;
  salon_id: number;
  rating: number;
  comment?: string;
  created_at: string;
  updated_at: string;
  created_by: string;
}

export interface SalonRatingFormData {
  rating: number;
  comment?: string;
}
