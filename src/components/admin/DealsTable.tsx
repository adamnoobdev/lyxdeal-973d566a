
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Deal } from "@/components/admin/types";
import { DealActions } from "@/components/admin/deals/DealActions";
import { Switch } from "@/components/ui/switch";
import { TicketPlus } from "lucide-react";
import { toast } from "sonner";
import { generateDiscountCodes } from "@/utils/discountCodeUtils";

interface DealsTableProps {
  deals: Deal[];
  onEdit?: (deal: Deal) => void;
  onDelete?: (deal: Deal) => void;
  onToggleActive?: (deal: Deal) => void;
  onApprove?: (dealId: number) => Promise<void>;
  onReject?: (dealId: number) => Promise<void>;
}

export const DealsTable = ({
  deals,
  onEdit,
  onDelete,
  onToggleActive,
  onApprove,
  onReject,
}: DealsTableProps) => {
  const handleGenerateCodes = async (dealId: number) => {
    try {
      toast.loading("Skapar rabattkoder...");
      
      // Generate 10 new codes
      const result = await generateDiscountCodes(dealId, 10);
      
      toast.dismiss();
      if (result.success) {
        toast.success(`${result.quantity} nya rabattkoder har skapats`);
      } else {
        toast.error("Kunde inte skapa rabattkoder");
      }
    } catch (error) {
      toast.dismiss();
      console.error('Error generating codes:', error);
      toast.error("Ett fel uppstod när rabattkoder skulle skapas");
    }
  };

  if (!deals.length) {
    return (
      <div className="text-center p-4 border rounded-md bg-muted/20">
        <p className="text-muted-foreground">Inga erbjudanden hittades</p>
      </div>
    );
  }

  return (
    <div className="rounded-md border overflow-hidden">
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[100px]">Status</TableHead>
              <TableHead>Titel</TableHead>
              <TableHead>Salong</TableHead>
              <TableHead className="hidden md:table-cell">Stad</TableHead>
              <TableHead className="hidden lg:table-cell">Pris</TableHead>
              <TableHead className="hidden md:table-cell">Kategori</TableHead>
              <TableHead className="text-right">Åtgärder</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {deals.map((deal) => (
              <TableRow key={deal.id}>
                <TableCell>
                  {deal.status === "pending" ? (
                    <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">
                      Väntar
                    </Badge>
                  ) : (
                    <div className="flex items-center">
                      <Switch
                        checked={deal.is_active}
                        onCheckedChange={() => onToggleActive?.(deal)}
                        className="mr-2"
                      />
                      <Badge
                        variant={deal.is_active ? "default" : "outline"}
                        className={deal.is_active ? "bg-emerald-100 text-emerald-700 hover:bg-emerald-100" : "bg-gray-50 text-gray-700"}
                      >
                        {deal.is_active ? "Aktiv" : "Inaktiv"}
                      </Badge>
                    </div>
                  )}
                </TableCell>
                <TableCell className="font-medium">
                  {deal.title.length > 30 ? `${deal.title.substring(0, 30)}...` : deal.title}
                </TableCell>
                <TableCell>{deal?.salons?.name}</TableCell>
                <TableCell className="hidden md:table-cell">{deal.city}</TableCell>
                <TableCell className="hidden lg:table-cell">
                  {deal.is_free ? (
                    <span className="font-semibold text-emerald-600">Gratis</span>
                  ) : (
                    <>
                      <span className="line-through text-muted-foreground mr-2">{deal.original_price} kr</span>
                      <span className="font-semibold text-primary">{deal.discounted_price} kr</span>
                    </>
                  )}
                </TableCell>
                <TableCell className="hidden md:table-cell">{deal.category}</TableCell>
                <TableCell className="text-right flex justify-end items-center gap-2">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="hidden sm:flex items-center gap-1"
                    onClick={() => handleGenerateCodes(deal.id)}
                  >
                    <TicketPlus className="h-4 w-4" />
                    <span className="hidden md:inline">Skapa koder</span>
                  </Button>
                  <DealActions
                    dealId={deal.id}
                    onEdit={() => onEdit?.(deal)}
                    onDelete={() => onDelete?.(deal)}
                    onToggleActive={() => onToggleActive?.(deal)}
                  />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};
