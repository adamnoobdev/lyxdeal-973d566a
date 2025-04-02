
import { supabase } from "@/integrations/supabase/client";
import { Deal } from "@/types/deal";

export const fetchSalonDeals = async (salonId: number): Promise<Deal[]> => {
  const { data: deals, error } = await supabase
    .from('deals')
    .select(`
      *,
      salons (
        name
      )
    `)
    .eq('salon_id', salonId);

  if (error) {
    console.error('Error fetching deals:', error);
    throw error;
  }

  // Transform the data to include required properties and add default values
  const transformedDeals = deals.map(deal => ({
    ...deal,
    is_free: deal.is_free || deal.discounted_price === 0, // Ensure is_free is set correctly
    expiration_date: deal.expiration_date || new Date().toISOString()
  }));

  // Add type assertion to make TypeScript happy
  return transformedDeals as unknown as Deal[];
};
