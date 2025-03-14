
import { Deal } from "@/components/admin/types";

export interface DealUpdateValues {
  title: string;
  description: string;
  imageUrl: string;
  originalPrice: number;
  discountedPrice: number;
  category: string;
  city: string;
  featured: boolean;
  is_free: boolean;
  quantity: number;
  expirationDate: Date;
  salon_id?: number;
  is_active?: boolean;
}

export interface UseSalonDealsReturn {
  deals: Deal[];
  activeDeals: Deal[];
  inactiveDeals: Deal[];
  isLoading: boolean;
  error: string | null;
  editingDeal: Deal | null;
  deletingDeal: Deal | null;
  setEditingDeal: (deal: Deal | null) => void;
  setDeletingDeal: (deal: Deal | null) => void;
  handleDelete: () => Promise<void>;
  handleUpdate: (values: any) => Promise<void>;
  handleToggleActive: (deal: Deal) => Promise<void>;
}
