
import { supabase } from "@/integrations/supabase/client";

/**
 * Checks if a salon has any deals
 */
export const checkSalonHasDeals = async (id: number) => {
  const { data, error } = await supabase
    .from("deals")
    .select("id")
    .eq("salon_id", id)
    .limit(1);

  if (error) throw error;
  return data && data.length > 0;
};
