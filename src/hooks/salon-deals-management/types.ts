
import { Deal } from "@/components/admin/types";
import { FormValues } from "@/components/deal-form/schema";

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
  handleUpdate: (values: FormValues) => Promise<boolean | void>;
  handleCreate: (values: FormValues) => Promise<boolean | void>;
  handleToggleActive: (deal: Deal) => Promise<void>;
  refetch: () => Promise<void>;
}
