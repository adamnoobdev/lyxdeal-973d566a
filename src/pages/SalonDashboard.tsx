import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useSession } from "@/hooks/useSession";
import { Card } from "@/components/ui/card";
import { DealForm } from "@/components/DealForm";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { DealsTable } from "@/components/admin/deals/DealsTable";
import { EditDealDialog } from "@/components/admin/deals/EditDealDialog";
import { DeleteDealDialog } from "@/components/admin/deals/DeleteDealDialog";
import { Deal } from "@/components/admin/types";
import { FormValues } from "@/components/deal-form/schema";
import { toast } from "sonner";

interface DealStats {
  deal_id: number;
  title: string;
  total_purchases: number;
}

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

      if (error) {
        console.error('Error fetching salon data:', error);
        throw error;
      }

      return data;
    },
    enabled: !!session?.user.id,
  });

  const { data: dealStats } = useQuery({
    queryKey: ['salon-deal-stats', salonData?.id],
    queryFn: async () => {
      if (!salonData?.id) throw new Error("No salon ID available");

      const { data: deals, error: dealsError } = await supabase
        .from('deals')
        .select(`
          id,
          title,
          purchases:purchases(count)
        `)
        .eq('salon_id', salonData.id);

      if (dealsError) {
        console.error('Error fetching deal stats:', dealsError);
        throw dealsError;
      }

      return deals.map(deal => ({
        deal_id: deal.id,
        title: deal.title,
        total_purchases: deal.purchases?.length || 0
      })) as DealStats[];
    },
    enabled: !!salonData?.id,
  });

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Salong Dashboard</h1>
        <Button onClick={() => setIsCreateDialogOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Skapa erbjudande
        </Button>
      </div>

      {dealStats && dealStats.length > 0 && (
        <div className="grid gap-4 md:grid-cols-3">
          {dealStats.map((stat) => (
            <Card key={stat.deal_id} className="p-4">
              <h3 className="font-semibold">{stat.title}</h3>
              <p className="text-sm text-muted-foreground">
                Antal köp: {stat.total_purchases}
              </p>
            </Card>
          ))}
        </div>
      )}

      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Skapa Erbjudande</DialogTitle>
          </DialogHeader>
          <DealForm onSubmit={async (values: FormValues) => {
            try {
              await supabase.from('deals').insert({
                ...values,
                salon_id: salonData?.id,
              });
              toast.success("Erbjudande skapat!");
              setIsCreateDialogOpen(false);
            } catch (error) {
              console.error("Error creating deal:", error);
              toast.error("Ett fel uppstod när erbjudandet skulle skapas.");
            }
          }} />
        </DialogContent>
      </Dialog>

      <EditDealDialog
        isOpen={!!editingDeal}
        onClose={() => setEditingDeal(null)}
        onSubmit={async (values: FormValues) => {
          if (!editingDeal) return;

          try {
            await supabase
              .from('deals')
              .update(values)
              .eq('id', editingDeal.id);
            toast.success("Erbjudande uppdaterat!");
            setEditingDeal(null);
          } catch (error) {
            console.error("Error updating deal:", error);
            toast.error("Ett fel uppstod när erbjudandet skulle uppdateras.");
          }
        }}
        initialValues={editingDeal ? {
          title: editingDeal.title,
          description: editingDeal.description,
          imageUrl: editingDeal.image_url,
          originalPrice: editingDeal.original_price.toString(),
          discountedPrice: editingDeal.discounted_price.toString(),
          category: editingDeal.category,
          city: editingDeal.city,
          timeRemaining: editingDeal.time_remaining,
          featured: editingDeal.featured,
        } : undefined}
      />

      <DeleteDealDialog
        isOpen={!!deletingDeal}
        onClose={() => setDeletingDeal(null)}
        onConfirm={async () => {
          if (!deletingDeal) return;

          try {
            await supabase
              .from('deals')
              .delete()
              .eq('id', deletingDeal.id);
            toast.success("Erbjudande borttaget!");
            setDeletingDeal(null);
          } catch (error) {
            console.error("Error deleting deal:", error);
            toast.error("Ett fel uppstod när erbjudandet skulle tas bort.");
          }
        }}
        dealTitle={deletingDeal?.title}
      />

      <DealsTable
        deals={dealStats}
        onEdit={setEditingDeal}
        onDelete={setDeletingDeal}
      />
    </div>
  );
}
