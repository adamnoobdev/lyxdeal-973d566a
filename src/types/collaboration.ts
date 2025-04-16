
export interface CollaborationRequest {
  id: string;
  salon_id: number;
  deal_id: number;
  title: string;
  description: string;
  compensation: string;
  status: 'active' | 'completed' | 'cancelled';
  created_at: string;
  updated_at: string;
  expires_at: string | null;
  max_creators: number;
  current_creators: number;
  salon_name?: string;
  deal_title?: string;
}

export interface CollaborationApplication {
  id: string;
  collaboration_id: string;
  creator_id: string;
  status: 'pending' | 'approved' | 'rejected';
  message: string | null;
  created_at: string;
  updated_at: string;
  creator_name?: string;
  creator_email?: string;
}

export interface ActiveCollaboration {
  id: string;
  collaboration_id: string;
  creator_id: string;
  salon_id: number;
  deal_id: number;
  discount_code: string;
  created_at: string;
  redemptions: number;
  views: number;
  creator_name?: string;
  creator_email?: string;
  deal_title?: string;
}
