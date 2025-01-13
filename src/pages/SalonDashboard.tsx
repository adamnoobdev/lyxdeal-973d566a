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

  const { data: deals } = useQuery({
    queryKey: ['salon-deals', salonData?.id],
    queryFn: async () => {
      if (!salonData?.id) throw new Error("No salon ID available");

      const { data: deals, error } = await supabase
        .from('deals')
        .select(`
          *,
          salons (
            name
          )
        `)
        .eq('salon_id', salonData.id);

      if (error) {
        console.error('Error fetching deals:', error);
        throw error;
      }

      return deals;
    },
    enabled: !!salonData?.id,
  });

  const handleCreateDeal = async (values: FormValues) => {
    try {
      const { error } = await supabase.from('deals').insert({
        title: values.title,
        description: values.description,
        image_url: values.imageUrl,
        original_price: parseInt(values.originalPrice),
        discounted_price: parseInt(values.discountedPrice),
        category: values.category,
        city: values.city,
        time_remaining: values.timeRemaining,
        featured: values.featured,
        salon_id: salonData?.id,
      });

      if (error) throw error;
      
      toast.success("Erbjudande skapat!");
      setIsCreateDialogOpen(false);
    } catch (error) {
      console.error("Error creating deal:", error);
      toast.error("Ett fel uppstod när erbjudandet skulle skapas.");
    }
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Salong Dashboard</h1>
        <Button onClick={() => setIsCreateDialogOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Skapa erbjudande
        </Button>
      </div>

      {deals && deals.length > 0 && (
        <div className="grid gap-4 md:grid-cols-3">
          {deals.map((deal) => (
            <Card key={deal.id} className="p-4">
              <h3 className="font-semibold">{deal.title}</h3>
              <p className="text-sm text-muted-foreground">
                Pris: {deal.discounted_price} kr
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
          <DealForm onSubmit={handleCreateDeal} />
        </DialogContent>
      </Dialog>

      <EditDealDialog
        isOpen={!!editingDeal}
        onClose={() => setEditingDeal(null)}
        onSubmit={async (values: FormValues) => {
          if (!editingDeal) return;

          try {
            const { error } = await supabase
              .from('deals')
              .update({
                title: values.title,
                description: values.description,
                image_url: values.imageUrl,
                original_price: parseInt(values.originalPrice),
                discounted_price: parseInt(values.discountedPrice),
                category: values.category,
                city: values.city,
                time_remaining: values.timeRemaining,
                featured: values.featured,
              })
              .eq('id', editingDeal.id);

            if (error) throw error;
            
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
          featured: editingDeal.featured || false,
          salon_id: editingDeal.salon_id,
        } : undefined}
      />

      <DeleteDealDialog
        isOpen={!!deletingDeal}
        onClose={() => setDeletingDeal(null)}
        onConfirm={async () => {
          if (!deletingDeal) return;

          try {
            const { error } = await supabase
              .from('deals')
              .delete()
              .eq('id', deletingDeal.id);

            if (error) throw error;
            
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
        deals={deals}
        onEdit={setEditingDeal}
        onDelete={setDeletingDeal}
      />
    </div>
  );
}