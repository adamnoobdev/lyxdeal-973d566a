
import { useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useOperationExclusion } from "@/hooks/useOperationExclusion";

export const usePendingDealsFunctions = (refetch: () => Promise<void>) => {
  const { runExclusiveOperation } = useOperationExclusion();
  
  const handleStatusChange = useCallback(async (dealId: number, newStatus: 'approved' | 'rejected') => {
    await runExclusiveOperation(async () => {
      try {
        console.log(`Changing deal status for ID ${dealId} to ${newStatus}`);
        const { error } = await supabase
          .from('deals')
          .update({ status: newStatus })
          .eq('id', dealId);

        if (error) throw error;

        toast.success(`Erbjudandet har ${newStatus === 'approved' ? 'godkänts' : 'nekats'}`);
        console.log("Status change successful, refetching deals");
        await refetch();
        return true;
      } catch (error) {
        console.error('Error updating deal status:', error);
        toast.error('Något gick fel när statusen skulle uppdateras');
        return false;
      }
    });
  }, [refetch, runExclusiveOperation]);

  return { handleStatusChange };
};
