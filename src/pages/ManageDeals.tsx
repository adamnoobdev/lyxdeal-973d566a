import { useDeals } from "@/hooks/useDeals";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { PriceDisplay } from "@/components/PriceDisplay";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Edit, Trash } from "lucide-react";

export default function ManageDeals() {
  const { data: deals, isLoading, error } = useDeals();

  const handleDelete = async (id: number) => {
    if (!window.confirm("Är du säker på att du vill ta bort detta erbjudande?")) {
      return;
    }

    try {
      const { error } = await supabase
        .from('deals')
        .delete()
        .eq('id', id);

      if (error) throw error;
      toast.success("Erbjudandet har tagits bort!");
    } catch (error) {
      console.error('Error:', error);
      toast.error("Något gick fel när erbjudandet skulle tas bort.");
    }
  };

  if (isLoading) return <div className="container mx-auto p-6">Laddar...</div>;
  if (error) return <div className="container mx-auto p-6">Ett fel uppstod: {error.message}</div>;

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Hantera Erbjudanden</h1>
        <Link to="/admin/new-deal">
          <Button>Skapa nytt erbjudande</Button>
        </Link>
      </div>

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
                  <Link to={`/admin/edit-deal/${deal.id}`}>
                    <Button variant="outline" size="icon">
                      <Edit className="h-4 w-4" />
                    </Button>
                  </Link>
                  <Button
                    variant="destructive"
                    size="icon"
                    onClick={() => handleDelete(deal.id)}
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
  );
}