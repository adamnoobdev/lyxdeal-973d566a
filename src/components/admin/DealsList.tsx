import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useState } from "react";
import { Deal } from "./types";
import { DealsTable } from "./deals/DealsTable";
import { EditDealDialog } from "./deals/EditDealDialog";
import { DeleteDealDialog } from "./deals/DeleteDealDialog";
import { Skeleton } from "@/components/ui/skeleton";

export const DealsList = () => {
  const [editingDeal, setEditingDeal] = useState<Deal | null>(null);
  const [deletingDeal, setDeletingDeal] = useState<Deal | null>(null);
  const queryClient = useQueryClient();

  const { data: deals, isLoading, error } = useQuery({
    queryKey: ["admin-deals"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("deals")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) {
        toast.error("Kunde inte hämta erbjudanden");
        throw error;
      }

      return data.map((deal) => ({
        id: deal.id,
        title: deal.title,
        description: deal.description,
        originalPrice: deal.original_price,
        discountedPrice: deal.discounted_price,
        category: deal.category,
        city: deal.city,
        timeRemaining: deal.time_remaining,
        imageUrl: deal.image_url,
        featured: deal.featured,
      }));
    },
  });

  const handleDelete = async (id: number) => {
    try {
      const { error } = await supabase.from("deals").delete().eq("id", id);
      if (error) throw error;
      queryClient.invalidateQueries({ queryKey: ["admin-deals"] });
      toast.success("Erbjudandet har tagits bort");
      setDeletingDeal(null);
    } catch (error) {
      console.error("Error:", error);
      toast.error("Kunde inte ta bort erbjudandet");
    }
  };

  const handleUpdate = async (values: any) => {
    try {
      const { error } = await supabase
        .from("deals")
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
        .eq("id", editingDeal?.id);

      if (error) throw error;

      queryClient.invalidateQueries({ queryKey: ["admin-deals"] });
      setEditingDeal(null);
      toast.success("Erbjudandet har uppdaterats");
    } catch (error) {
      console.error("Error:", error);
      toast.error("Kunde inte uppdatera erbjudandet");
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-3">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="flex items-center space-x-4">
            <Skeleton className="h-12 w-[250px]" />
            <Skeleton className="h-12 w-[150px]" />
            <Skeleton className="h-12 w-[150px]" />
            <Skeleton className="h-12 w-[100px]" />
            <Skeleton className="h-12 w-[100px]" />
          </div>
        ))}
      </div>
    );
  }

  if (error) return (
    <div className="text-center py-8 text-red-500">
      Ett fel uppstod när erbjudanden skulle hämtas
    </div>
  );

  return (
    <>
      <DealsTable
        deals={deals || []}
        onEdit={setEditingDeal}
        onDelete={setDeletingDeal}
      />

      <EditDealDialog
        isOpen={!!editingDeal}
        onClose={() => setEditingDeal(null)}
        onSubmit={handleUpdate}
        initialValues={
          editingDeal
            ? {
                title: editingDeal.title,
                description: editingDeal.description,
                imageUrl: editingDeal.imageUrl,
                originalPrice: editingDeal.originalPrice.toString(),
                discountedPrice: editingDeal.discountedPrice.toString(),
                category: editingDeal.category,
                city: editingDeal.city,
                timeRemaining: editingDeal.timeRemaining,
                featured: editingDeal.featured,
              }
            : undefined
        }
      />

      <DeleteDealDialog
        isOpen={!!deletingDeal}
        onClose={() => setDeletingDeal(null)}
        onConfirm={() => deletingDeal && handleDelete(deletingDeal.id)}
        dealTitle={deletingDeal?.title}
      />
    </>
  );
};