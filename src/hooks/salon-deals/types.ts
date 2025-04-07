
import { Deal } from "@/types/deal";
import { FormValues } from "@/components/deal-form/schema";

export interface UseSalonDealsResult {
  deals: Deal[];
  pendingDeals: Deal[];
  approvedDeals: Deal[];
  rejectedDeals: Deal[];
  activeDeals: Deal[];  // Added property
  inactiveDeals: Deal[]; // Added property
  isLoading: boolean;   // Added property
  error: string | null; // Added property
  createDeal: (values: FormValues) => Promise<boolean>;
  updateDeal: (values: FormValues, dealId: number) => Promise<boolean>;
  deleteDeal: (dealId: number) => Promise<boolean>;
  refetch?: () => Promise<void>;
}
