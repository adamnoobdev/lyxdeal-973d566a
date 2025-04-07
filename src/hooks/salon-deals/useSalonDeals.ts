
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
  const { data: deals = [], refetch: queryRefetch, isLoading, error } = useQuery({
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
      await refetch();
    }
    return success;
  };

  const handleUpdateDeal = async (values: FormValues, dealId: number): Promise<boolean> => {
    const success = await updateDeal(values, dealId);
    if (success) {
      await refetch();
    }
    return success;
  };

  const handleDeleteDeal = async (dealId: number): Promise<boolean> => {
    const success = await deleteDeal(dealId);
    if (success) {
      await refetch();
    }
    return success;
  };

  // Wrapper function to convert the refetch function to return Promise<void>
  const refetch = async (): Promise<void> => {
    await queryRefetch();
  };

  const pendingDeals = deals.filter(deal => deal.status === 'pending');
  const approvedDeals = deals.filter(deal => deal.status === 'approved');
  const rejectedDeals = deals.filter(deal => deal.status === 'rejected');
  const activeDeals = deals.filter(deal => deal.is_active);
  const inactiveDeals = deals.filter(deal => !deal.is_active);

  return {
    deals,
    pendingDeals,
    approvedDeals,
    rejectedDeals,
    activeDeals,
    inactiveDeals,
    isLoading,
    error: error ? String(error) : null,
    createDeal: handleCreateDeal,
    updateDeal: handleUpdateDeal,
    deleteDeal: handleDeleteDeal,
    refetch,
  };
};
