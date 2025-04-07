
import { Deal } from "@/types/deal";
import { FormValues } from "@/components/deal-form/schema";

export interface UseSalonDealsResult {
  deals: Deal[];
  pendingDeals: Deal[];
  approvedDeals: Deal[];
  rejectedDeals: Deal[];
  createDeal: (values: FormValues) => Promise<boolean>;
  updateDeal: (values: FormValues, dealId: number) => Promise<boolean>;
  deleteDeal: (dealId: number) => Promise<boolean>;
  refetch?: () => Promise<void>;
}
