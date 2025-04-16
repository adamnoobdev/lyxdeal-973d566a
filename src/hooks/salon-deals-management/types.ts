
import { Deal } from "@/types/deal";
import { FormValues } from "@/components/deal-form/schema";

export interface UseSalonDealsReturn {
  deals: Deal[];
  activeDeals: Deal[];
  inactiveDeals: Deal[];
  isLoading: boolean;
  error: string | null;
  editingDeal: Deal | null;
  deletingDeal: Deal | null;
  setEditingDeal: React.Dispatch<React.SetStateAction<Deal | null>>;
  setDeletingDeal: React.Dispatch<React.SetStateAction<Deal | null>>;
  handleDelete: () => Promise<void>;
  handleUpdate: (values: FormValues) => Promise<boolean | void>;
  handleCreate: (values: FormValues) => Promise<boolean | void>;
  handleToggleActive: (deal: Deal) => Promise<void>;
  refetch: () => Promise<void>;
}
