
export interface SalonRating {
  id: number;
  salon_id: number;
  /**
   * Rating stored as integer in database (e.g., 47 for 4.7)
   * Will need to be divided by 10 for display
   */
  rating: number;
  comment?: string;
  created_at: string;
  updated_at: string;
  created_by: string;
}

export interface SalonRatingFormData {
  /**
   * Rating as decimal for UI display (e.g., 4.7)
   */
  rating: number;
  comment?: string;
}
