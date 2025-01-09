import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { PriceDisplay } from "@/components/PriceDisplay";
import { Edit, Trash } from "lucide-react";
import { toast } from "sonner";
import { useState } from "react";
import { DealForm } from "../DealForm";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface Deal {
  id: number;
  title: string;
  description: string;
  originalPrice: number;
  discountedPrice: number;
  category: string;
  city: string;
  timeRemaining: string;
  imageUrl: string;
  featured: boolean;
}

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

  const handleEdit = (deal: Deal) => {
    setEditingDeal(deal);
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

  if (isLoading) return <div>Laddar...</div>;
  if (error) return <div>Ett fel uppstod</div>;

  return (
    <>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Titel</TableHead>
              <TableHead>Kategori</TableHead>
              <TableHead>Stad</TableHead>
              <TableHead>Pris</TableHead>
              <TableHead>Åtgärder</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {deals?.map((deal) => (
              <TableRow key={deal.id}>
                <TableCell>{deal.title}</TableCell>
                <TableCell>{deal.category}</TableCell>
                <TableCell>{deal.city}</TableCell>
                <TableCell>
                  <PriceDisplay
                    originalPrice={deal.originalPrice}
                    discountedPrice={deal.discountedPrice}
                  />
                </TableCell>
                <TableCell>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => handleEdit(deal)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => setDeletingDeal(deal)}
                    >
                      <Trash className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <Dialog open={!!editingDeal} onOpenChange={() => setEditingDeal(null)}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Redigera erbjudande</DialogTitle>
          </DialogHeader>
          {editingDeal && (
            <DealForm
              onSubmit={handleUpdate}
              initialValues={{
                title: editingDeal.title,
                description: editingDeal.description,
                imageUrl: editingDeal.imageUrl,
                originalPrice: editingDeal.originalPrice.toString(),
                discountedPrice: editingDeal.discountedPrice.toString(),
                category: editingDeal.category,
                city: editingDeal.city,
                timeRemaining: editingDeal.timeRemaining,
                featured: editingDeal.featured,
              }}
            />
          )}
        </DialogContent>
      </Dialog>

      <AlertDialog open={!!deletingDeal} onOpenChange={() => setDeletingDeal(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Är du säker?</AlertDialogTitle>
            <AlertDialogDescription>
              Detta kommer permanent ta bort erbjudandet "{deletingDeal?.title}". Denna åtgärd kan inte ångras.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Avbryt</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => deletingDeal && handleDelete(deletingDeal.id)}
            >
              Ta bort
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};