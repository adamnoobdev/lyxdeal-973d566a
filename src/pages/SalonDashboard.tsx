
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useSession } from "@/hooks/useSession";
import { Button } from "@/components/ui/button";
import { Plus, ExternalLink } from "lucide-react";
import { useState, useEffect } from "react";
import { Deal } from "@/types/deal";
import { useNavigate } from "react-router-dom";
import { DealsSection } from "@/components/salon/DealsSection";
import { DealDialog } from "@/components/salon/DealDialog";
import { useSalonDeals } from "@/hooks/useSalonDeals";
import { FormValues } from "@/components/deal-form/schema";
import { endOfMonth } from 'date-fns';
import { PasswordChangeDialog } from "@/components/salon/PasswordChangeDialog";
import { useFirstLogin } from "@/hooks/useFirstLogin";
import { DealStatistics } from "@/components/salon/DealStatistics";
import { CustomersTable } from "@/components/salon/CustomersTable";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { InfoIcon } from "lucide-react";
import { DiscountCodesDialog } from "@/components/admin/deals/DiscountCodesDialog";

export default function SalonDashboard() {
  const { session } = useSession();
  const { isFirstLogin, isLoading: checkingFirstLogin } = useFirstLogin();
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [editingDeal, setEditingDeal] = useState<Deal | null>(null);
  const [deletingDeal, setDeletingDeal] = useState<Deal | null>(null);
  const [viewingCodesForDeal, setViewingCodesForDeal] = useState<Deal | null>(null);
  const [showPasswordDialog, setShowPasswordDialog] = useState(false);
  const [activeTab, setActiveTab] = useState("overview");
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

  const handleCreate = async (values: FormValues): Promise<void> => {
    await createDeal(values);
    setIsCreateDialogOpen(false);
  };

  const handleUpdate = async (values: FormValues): Promise<void> => {
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
    <div className="container mx-auto p-6 space-y-8">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
        <h1 className="text-3xl font-bold">Salong Dashboard</h1>
        <Button onClick={() => setIsCreateDialogOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Skapa erbjudande
        </Button>
      </div>

      <Alert className="bg-blue-50 border-blue-200">
        <InfoIcon className="h-4 w-4 text-blue-500" />
        <AlertDescription className="text-blue-700">
          Välkommen till din salongdashboard! Här kan du skapa och hantera erbjudanden, 
          se statistik och hantera kundlistor.
        </AlertDescription>
      </Alert>

      {/* Statistiksektion */}
      <div className="space-y-2">
        <h2 className="text-xl font-semibold">Statistik översikt</h2>
        <DealStatistics salonId={salonData?.id} />
      </div>

      {/* Tabs för att växla mellan olika vyer */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="bg-secondary/10 border border-secondary/30">
          <TabsTrigger value="overview">Erbjudanden</TabsTrigger>
          <TabsTrigger value="customers">Kundlista</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-8">
          {/* Erbjudanden-sektioner */}
          <DealsSection
            title="Väntande godkännande"
            deals={pendingDeals}
            alertMessage="Dessa erbjudanden väntar på godkännande från en administratör innan de publiceras."
            onEdit={handleEditDeal}
            onDelete={handleDeleteDeal}
            onViewDetails={handleViewDealDetails}
            onViewDiscountCodes={handleViewDiscountCodes}
          />

          <DealsSection
            title="Aktiva erbjudanden"
            deals={approvedDeals}
            onEdit={handleEditDeal}
            onDelete={handleDeleteDeal}
            onViewDetails={handleViewDealDetails}
            onViewDiscountCodes={handleViewDiscountCodes}
          />

          <DealsSection
            title="Nekade erbjudanden"
            deals={rejectedDeals}
            alertVariant="destructive"
            alertMessage="Dessa erbjudanden har nekats av en administratör. Du kan redigera och skicka in dem igen för ny granskning."
            onEdit={handleEditDeal}
            onDelete={handleDeleteDeal}
            onViewDetails={handleViewDealDetails}
          />
        </TabsContent>

        <TabsContent value="customers">
          <Card className="border border-secondary/20 rounded-lg overflow-hidden p-4">
            <CardHeader className="p-0 pb-4">
              <CardTitle className="text-xl">Kunder som säkrat dina erbjudanden</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <CustomersTable />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Dialoger */}
      <DealDialog
        isOpen={isCreateDialogOpen}
        onClose={() => setIsCreateDialogOpen(false)}
        onSubmit={handleCreate}
      />

      <DealDialog
        isOpen={!!editingDeal}
        onClose={() => setEditingDeal(null)}
        onSubmit={handleUpdate}
        initialValues={editingDeal ? {
          title: editingDeal.title,
          description: editingDeal.description,
          imageUrl: editingDeal.image_url,
          originalPrice: editingDeal.original_price.toString(),
          discountedPrice: editingDeal.discounted_price.toString(),
          category: editingDeal.category,
          city: editingDeal.city,
          featured: editingDeal.featured,
          salon_id: editingDeal.salon_id,
          is_free: editingDeal.is_free,
          quantity: editingDeal.quantity_left?.toString() || "10",
          expirationDate: editingDeal.expiration_date ? new Date(editingDeal.expiration_date) : endOfMonth(new Date()),
        } : undefined}
      />

      <PasswordChangeDialog
        isOpen={showPasswordDialog}
        onClose={() => setShowPasswordDialog(false)}
      />

      <DiscountCodesDialog
        isOpen={!!viewingCodesForDeal && !isClosingCodesDialog}
        onClose={handleCloseDiscountCodesDialog}
        deal={viewingCodesForDeal}
      />
    </div>
  );
}
