
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useSession } from "@/hooks/useSession";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useState } from "react";
import { Deal } from "@/types/deal";
import { DealsSection } from "@/components/salon/DealsSection";
import { DealDialog } from "@/components/salon/DealDialog";
import { useSalonDeals } from "@/hooks/useSalonDeals";
import { FormValues } from "@/components/deal-form/schema";
import { addDays, endOfMonth } from 'date-fns';

export default function SalonDashboard() {
  const { session } = useSession();
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [editingDeal, setEditingDeal] = useState<Deal | null>(null);
  const [deletingDeal, setDeletingDeal] = useState<Deal | null>(null);

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

  return (
    <div className="container mx-auto p-6 space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Salong Dashboard</h1>
        <Button onClick={() => setIsCreateDialogOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Skapa erbjudande
        </Button>
      </div>

      <DealsSection
        title="Väntande godkännande"
        deals={pendingDeals}
        alertMessage="Dessa erbjudanden väntar på godkännande från en administratör innan de publiceras."
        onEdit={setEditingDeal}
        onDelete={setDeletingDeal}
      />

      <DealsSection
        title="Aktiva erbjudanden"
        deals={approvedDeals}
        onEdit={setEditingDeal}
        onDelete={setDeletingDeal}
      />

      <DealsSection
        title="Nekade erbjudanden"
        deals={rejectedDeals}
        alertVariant="destructive"
        alertMessage="Dessa erbjudanden har nekats av en administratör. Du kan redigera och skicka in dem igen för ny granskning."
        onEdit={setEditingDeal}
        onDelete={setDeletingDeal}
      />

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
    </div>
  );
}
