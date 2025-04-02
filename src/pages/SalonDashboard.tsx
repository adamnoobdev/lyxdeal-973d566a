
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useSession } from "@/hooks/useSession";
import { useState, useEffect } from "react";
import { Deal } from "@/types/deal";
import { useNavigate } from "react-router-dom";
import { useSalonDeals } from "@/hooks/salon-deals";
import { useFirstLogin } from "@/hooks/useFirstLogin";
import { DealStatistics } from "@/components/salon/DealStatistics";
import { DashboardHeader } from "@/components/salon/dashboard/Header";
import { WelcomeAlert } from "@/components/salon/dashboard/WelcomeAlert";
import { MainTabs } from "@/components/salon/dashboard/MainTabs";
import { DashboardDialogs } from "@/components/salon/dashboard/Dialogs";
import { ScrollArea } from "@/components/ui/scroll-area";

export default function SalonDashboard() {
  const { session } = useSession();
  const { isFirstLogin, isLoading: checkingFirstLogin } = useFirstLogin();
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [editingDeal, setEditingDeal] = useState<Deal | null>(null);
  const [deletingDeal, setDeletingDeal] = useState<Deal | null>(null);
  const [viewingCodesForDeal, setViewingCodesForDeal] = useState<Deal | null>(null);
  const [showPasswordDialog, setShowPasswordDialog] = useState(false);
  const [isClosingCodesDialog, setIsClosingCodesDialog] = useState(false);
  const navigate = useNavigate();

  const { data: salonData } = useQuery({
    queryKey: ['salon', session?.user.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('salons')
        .select('*')
        .eq('user_id', session?.user.id)
        .single();

      if (error) throw error;
      return data;
    },
    enabled: !!session?.user.id,
  });

  const {
    pendingDeals,
    approvedDeals,
    rejectedDeals,
    createDeal,
    updateDeal,
    deleteDeal,
  } = useSalonDeals(salonData?.id);

  useEffect(() => {
    // Visa lösenordsdialog om det är första inloggningen och inte laddar
    if (!checkingFirstLogin && isFirstLogin) {
      setShowPasswordDialog(true);
    }
  }, [isFirstLogin, checkingFirstLogin]);

  const handleCreate = async (values: any): Promise<void> => {
    await createDeal(values);
    setIsCreateDialogOpen(false);
  };

  const handleUpdate = async (values: any): Promise<void> => {
    if (editingDeal) {
      await updateDeal(values, editingDeal.id);
      setEditingDeal(null);
    }
  };

  // Helper functions to handle Deal type compatibility
  const handleEditDeal = (deal: Deal) => {
    setEditingDeal(deal);
  };

  const handleDeleteDeal = (deal: Deal) => {
    setDeletingDeal(deal);
  };

  const handleViewDiscountCodes = (deal: Deal) => {
    setViewingCodesForDeal(deal);
  };

  const handleCloseDiscountCodesDialog = () => {
    setIsClosingCodesDialog(true);
    setTimeout(() => {
      setViewingCodesForDeal(null);
      setIsClosingCodesDialog(false);
    }, 300);
  };

  const handleViewDealDetails = (deal: Deal) => {
    navigate(`/salon/deal/${deal.id}`);
  };

  return (
    <div className="flex w-full min-h-screen">
      <div className="flex-1 overflow-hidden pt-0 sm:pt-0">
        <ScrollArea className="h-screen">
          <div className="container mx-auto p-4 sm:p-6 space-y-4 sm:space-y-6 max-w-6xl">
            <DashboardHeader onCreateClick={() => setIsCreateDialogOpen(true)} />
            <WelcomeAlert />

            {/* Statistiksektion */}
            <div className="space-y-2">
              <h2 className="text-lg sm:text-xl font-semibold">Statistik översikt</h2>
              <DealStatistics salonId={salonData?.id} />
            </div>

            {/* MainTabs component */}
            <MainTabs />

            {/* Dialoger */}
            <DashboardDialogs
              isCreateDialogOpen={isCreateDialogOpen}
              onCloseCreateDialog={() => setIsCreateDialogOpen(false)}
              onCreate={handleCreate}
              editingDeal={editingDeal}
              onCloseEditDialog={() => setEditingDeal(null)}
              onUpdate={handleUpdate}
              showPasswordDialog={showPasswordDialog}
              onClosePasswordDialog={() => setShowPasswordDialog(false)}
              viewingCodesForDeal={viewingCodesForDeal}
              isClosingCodesDialog={isClosingCodesDialog}
              onCloseCodesDialog={handleCloseDiscountCodesDialog}
            />
          </div>
        </ScrollArea>
      </div>
    </div>
  );
}
