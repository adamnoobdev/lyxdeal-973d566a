
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Deal } from "@/components/admin/types";
import { DealsTable } from "../deals/DealsTable";
import { EditDealDialog } from "../deals/EditDealDialog";
import { DeleteDealDialog } from "../deals/DeleteDealDialog";
import { DealsLoadingSkeleton } from "../deals/DealsLoadingSkeleton";
import { supabase } from "@/integrations/supabase/client";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import { toast } from "sonner";

export function SalonDeals() {
  const { salonId } = useParams();
  const [deals, setDeals] = useState<Deal[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editingDeal, setEditingDeal] = useState<Deal | null>(null);
  const [deletingDeal, setDeletingDeal] = useState<Deal | null>(null);

  useEffect(() => {
    fetchSalonDeals();
  }, [salonId]);

  const fetchSalonDeals = async () => {
    try {
      setIsLoading(true);
      setError(null);

      if (!salonId) {
        throw new Error("No salon ID provided");
      }

      const salonIdNumber = parseInt(salonId);
      if (isNaN(salonIdNumber)) {
        throw new Error("Invalid salon ID");
      }

      const { data, error } = await supabase
        .from("deals")
        .select("*")
        .eq("salon_id", salonIdNumber)
        .order("created_at", { ascending: false });

      if (error) throw error;

      // Type assertion to ensure status is of the correct type
      const typedDeals = (data || []).map(deal => ({
        ...deal,
        status: deal.status as 'pending' | 'approved' | 'rejected'
      }));

      setDeals(typedDeals);
    } catch (err: any) {
      console.error("Error fetching salon deals:", err);
      setError(err.message);
      toast.error("Ett fel uppstod när erbjudanden skulle hämtas");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!deletingDeal) return;

    try {
      const { error } = await supabase
        .from("deals")
        .delete()
        .eq("id", deletingDeal.id);

      if (error) throw error;

      toast.success("Erbjudandet har tagits bort");
      await fetchSalonDeals();
      setDeletingDeal(null);
    } catch (err: any) {
      console.error("Error deleting deal:", err);
      toast.error("Ett fel uppstod när erbjudandet skulle tas bort");
    }
  };

  const handleUpdate = async (values: any) => {
    if (!editingDeal) return;

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
          is_free: values.is_free || false,
          status: 'pending' as const,
        })
        .eq("id", editingDeal.id);

      if (error) throw error;

      toast.success("Erbjudandet har uppdaterats");
      await fetchSalonDeals();
      setEditingDeal(null);
    } catch (err: any) {
      console.error("Error updating deal:", err);
      toast.error("Ett fel uppstod när erbjudandet skulle uppdateras");
    }
  };

  if (isLoading) {
    return <DealsLoadingSkeleton />;
  }

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    );
  }

  if (!deals?.length) {
    return (
      <Alert>
        <AlertDescription>
          Denna salong har inga aktiva erbjudanden.
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <>
      <DealsTable
        deals={deals}
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
                imageUrl: editingDeal.image_url,
                originalPrice: editingDeal.original_price.toString(),
                discountedPrice: editingDeal.discounted_price.toString(),
                category: editingDeal.category,
                city: editingDeal.city,
                timeRemaining: editingDeal.time_remaining,
                featured: editingDeal.featured,
                salon_id: editingDeal.salon_id,
                is_free: editingDeal.is_free || false,
                quantity: editingDeal.quantity_left?.toString() || "10",
              }
            : undefined
        }
      />

      <DeleteDealDialog
        isOpen={!!deletingDeal}
        onClose={() => setDeletingDeal(null)}
        onConfirm={handleDelete}
        dealTitle={deletingDeal?.title}
      />
    </>
  );
};
