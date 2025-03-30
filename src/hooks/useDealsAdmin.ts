
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Deal } from "@/types/deal";
import { FormValues } from "@/components/deal-form/schema";
import { useCallback } from "react";
import { createDeal, updateDeal, deleteDeal, toggleDealActive } from "@/utils/deal/queries";

/**
 * Hook för att hantera erbjudanden i admin-gränssnittet
 */
export const useDealsAdmin = () => {
  // Hämta alla erbjudanden med användning av React Query
  const { data: deals = [], isLoading, error, refetch } = useQuery({
    queryKey: ['deals'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('deals')
        .select(`
          *,
          salons (
            name
          )
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data as Deal[];
    }
  });

  // Wrapper för att ta bort ett erbjudande
  const handleDelete = useCallback(async (id: number) => {
    const success = await deleteDeal(id);
    if (success) await refetch();
    return success;
  }, [refetch]);

  // Wrapper för att uppdatera ett erbjudande
  const handleUpdate = useCallback(async (values: FormValues, id: number) => {
    const success = await updateDeal(values, id);
    if (success) await refetch();
    return success;
  }, [refetch]);

  // Wrapper för att skapa ett nytt erbjudande
  const handleCreate = useCallback(async (values: FormValues) => {
    const success = await createDeal(values);
    if (success) await refetch();
    return success;
  }, [refetch]);

  // Wrapper för att växla aktiv/inaktiv status
  const handleToggleActive = useCallback(async (deal: Deal) => {
    const success = await toggleDealActive(deal);
    if (success) await refetch();
    return success;
  }, [refetch]);

  // Filtrera erbjudanden efter aktiva/inaktiva
  const activeDeals = deals.filter(deal => deal.is_active);
  const inactiveDeals = deals.filter(deal => !deal.is_active);

  return {
    deals,
    activeDeals,
    inactiveDeals,
    isLoading,
    error,
    handleDelete,
    handleUpdate,
    handleCreate,
    handleToggleActive,
    refetch
  };
};
