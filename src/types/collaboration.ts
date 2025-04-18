
export type CollaborationRequest = {
  id: string;
  salon_id: number;
  deal_id: number;
  title: string;
  description: string;
  compensation: string;
  status: "active" | "completed" | "cancelled";
  created_at: string;
  updated_at: string;
  expires_at: string;
  max_creators: number;
  current_creators: number;
  salon_name?: string;
  deal_title?: string;
}

export type CollaborationApplication = {
  id: string;
  collaboration_id: string;
  creator_id: string;
  status: "pending" | "approved" | "rejected";
  message: string;
  created_at: string;
  updated_at: string;
  collaboration_title?: string;
  salon_name?: string;
  deal_title?: string;
  creator_email?: string;
  collaborations?: {
    title: string;
    salon_id: number;
    deal_id: number;
  };
}

export type ActiveCollaboration = {
  id: string;
  collaboration_id: string;
  creator_id: string;
  salon_id: number;
  deal_id: number;
  discount_code: string;
  views: number;
  redemptions: number;
  created_at: string;
  
  // Flattened properties for direct access
  salon_name?: string;
  salon_website?: string; // Obs! Denna finns inte i databasen men används i koden
  deal_title?: string;
  deal_description?: string;
  booking_url?: string;
  collaboration_title?: string;
  collaboration_description?: string;
  compensation?: string;
  creator_email?: string;
}
