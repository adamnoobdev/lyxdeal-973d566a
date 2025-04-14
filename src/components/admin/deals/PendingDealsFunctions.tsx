
import { useCallback, useState } from "react";
import { supabase } from '@/integrations/supabase/client';
import { toast } from "sonner";
import { useOperationExclusion } from "@/hooks/useOperationExclusion";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

export const usePendingDealsFunctions = (refetch: () => Promise<unknown>) => {
  const { runExclusiveOperation } = useOperationExclusion();
  const [rejectionReason, setRejectionReason] = useState<string>("");
  const [dealToReject, setDealToReject] = useState<number | null>(null);
  const [isRejectionDialogOpen, setIsRejectionDialogOpen] = useState<boolean>(false);
  
  const handleStatusChange = useCallback(async (dealId: number, newStatus: 'approved' | 'rejected') => {
    // Om ett erbjudande ska avslås, visa dialogrutan för att ange anledning
    if (newStatus === 'rejected') {
      setDealToReject(dealId);
      setIsRejectionDialogOpen(true);
      return;
    }
    
    await runExclusiveOperation(async () => {
      try {
        console.log(`Changing deal status for ID ${dealId} to ${newStatus}`);
        
        // Update the deal status and set active based on approval
        const { error } = await supabase
          .from('deals')
          .update({ 
            status: newStatus,
            is_active: newStatus === 'approved' // Set active if approved
          })
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

  const handleRejectWithReason = useCallback(async () => {
    if (!dealToReject || !rejectionReason.trim()) {
      toast.error("Du måste ange en anledning till avslaget");
      return;
    }

    await runExclusiveOperation(async () => {
      try {
        console.log(`Rejecting deal ${dealToReject} with reason: ${rejectionReason}`);
        
        const { error } = await supabase
          .from('deals')
          .update({ 
            status: 'rejected',
            is_active: false,
            rejection_message: rejectionReason
          })
          .eq('id', dealToReject);

        if (error) throw error;

        toast.success("Erbjudandet har nekats och ett meddelande har skickats till salongen");
        setIsRejectionDialogOpen(false);
        setRejectionReason("");
        setDealToReject(null);
        
        await refetch();
        return true;
      } catch (error) {
        console.error('Error rejecting deal:', error);
        toast.error('Något gick fel när erbjudandet skulle nekas');
        return false;
      }
    });
  }, [dealToReject, rejectionReason, refetch, runExclusiveOperation]);

  const RejectionDialog = () => (
    <Dialog open={isRejectionDialogOpen} onOpenChange={setIsRejectionDialogOpen}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Ange anledning till avslag</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-3">
          <p className="text-sm text-muted-foreground">
            För att avslå ett erbjudande behöver du ange en anledning så att salongen kan korrigera problemet.
          </p>
          <Textarea 
            value={rejectionReason} 
            onChange={(e) => setRejectionReason(e.target.value)}
            placeholder="Skriv anledningen till avslaget här..."
            className="resize-none min-h-[120px]"
          />
        </div>
        <DialogFooter className="sm:justify-between">
          <Button 
            type="button" 
            variant="outline" 
            onClick={() => {
              setIsRejectionDialogOpen(false);
              setRejectionReason("");
              setDealToReject(null);
            }}
          >
            Avbryt
          </Button>
          <Button 
            type="button" 
            variant="destructive" 
            onClick={handleRejectWithReason}
            disabled={!rejectionReason.trim()}
          >
            Avslå erbjudande
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );

  return { 
    handleStatusChange, 
    RejectionDialog,
    isRejectionDialogOpen
  };
};
