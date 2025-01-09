import { useQuery } from "@tanstack/react-query";
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
import { edit, trash } from "lucide-react";
import { toast } from "sonner";

interface Deal {
  id: number;
  title: string;
  description: string;
  originalPrice: number;
  discountedPrice: number;
  category: string;
  city: string;
  timeRemaining: string;
}

export const DealsList = () => {
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
      }));
    },
  });

  const handleDelete = async (id: number) => {
    try {
      const { error } = await supabase.from("deals").delete().eq("id", id);
      if (error) throw error;
      toast.success("Erbjudandet har tagits bort");
    } catch (error) {
      console.error("Error:", error);
      toast.error("Kunde inte ta bort erbjudandet");
    }
  };

  if (isLoading) return <div>Laddar...</div>;
  if (error) return <div>Ett fel uppstod</div>;

  return (
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
                    onClick={() => console.log("Edit:", deal.id)}
                  >
                    <edit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => handleDelete(deal.id)}
                  >
                    <trash className="h-4 w-4" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};