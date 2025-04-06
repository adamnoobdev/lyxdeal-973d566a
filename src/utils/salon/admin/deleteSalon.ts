
import { supabase } from "@/integrations/supabase/client";

/**
 * Deletes a salon from the database
 */
export const deleteSalonData = async (id: number) => {
  const { error } = await supabase
    .from("salons")
    .delete()
    .eq("id", id);

  if (error) throw error;
};
