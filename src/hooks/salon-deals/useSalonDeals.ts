
import { useQuery } from "@tanstack/react-query";
import { FormValues } from "@/components/deal-form/schema";
import { fetchSalonDeals } from "./fetchDeals";
import { createDeal } from "./createDeal";
import { updateDeal } from "./updateDeal";
import { deleteDeal } from "./deleteDeal";
import { UseSalonDealsResult } from "./types";

export const useSalonDeals = (
  salonId: number | undefined
): UseSalonDealsResult => {
  const { data: deals = [], refetch } = useQuery({
    queryKey: ['salon-deals', salonId],
    queryFn: async () => {
      if (!salonId) throw new Error("No salon ID available");
      return fetchSalonDeals(salonId);
    },
    enabled: !!salonId,
  });

  const handleCreateDeal = async (values: FormValues): Promise<boolean> => {
    const success = await createDeal(values, salonId);
    if (success) {
      refetch();
    }
    return success;
  };

  const handleUpdateDeal = async (values: FormValues, dealId: number): Promise<boolean> => {
    const success = await updateDeal(values, dealId);
    if (success) {
      refetch();
    }
    return success;
  };

  const handleDeleteDeal = async (dealId: number): Promise<boolean> => {
    const success = await deleteDeal(dealId);
    if (success) {
      refetch();
    }
    return success;
  };

  const pendingDeals = deals.filter(deal => deal.status === 'pending');
  const approvedDeals = deals.filter(deal => deal.status === 'approved');
  const rejectedDeals = deals.filter(deal => deal.status === 'rejected');

  return {
    deals,
    pendingDeals,
    approvedDeals,
    rejectedDeals,
    createDeal: handleCreateDeal,
    updateDeal: handleUpdateDeal,
    deleteDeal: handleDeleteDeal,
  };
};
