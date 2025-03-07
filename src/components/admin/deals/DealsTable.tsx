
import { Deal } from "@/components/admin/types";
import { DealActions } from "./DealActions";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { formatCurrency } from "@/utils/dealApiUtils";
import { Card } from "@/components/ui/card";

interface DealsTableProps {
  deals: Deal[];
  onEdit?: (deal: Deal) => void;
  onDelete?: (deal: Deal) => void;
  onToggleActive?: ((deal: Deal) => void) | undefined;
  hasViewDetailsAction?: boolean;
  onViewDetails?: (deal: Deal) => void;
  showApprovalActions?: boolean;
  onApprove?: (dealId: number) => void;
  onReject?: (dealId: number) => void;
}

export const DealsTable = ({ 
  deals, 
  onEdit, 
  onDelete, 
  onToggleActive,
  hasViewDetailsAction = false,
  onViewDetails,
  showApprovalActions,
  onApprove,
  onReject
}: DealsTableProps) => {
  return (
    <Card className="border border-secondary/20 rounded-lg overflow-hidden shadow-sm">
      <ScrollArea className="w-full max-w-full overflow-auto">
        <Table>
          <TableHeader className="bg-primary/5 sticky top-0 z-10">
            <TableRow>
              <TableHead className="min-w-[200px] font-semibold text-primary">Titel</TableHead>
              <TableHead className="min-w-[120px] font-semibold text-primary">Salong</TableHead>
              <TableHead className="min-w-[100px] font-semibold text-primary">Pris</TableHead>
              <TableHead className="min-w-[100px] font-semibold text-primary">Rabatterat</TableHead>
              <TableHead className="min-w-[120px] font-semibold text-primary">Kvar</TableHead>
              <TableHead className="min-w-[120px] font-semibold text-primary">Status</TableHead>
              <TableHead className="min-w-[100px] text-right font-semibold text-primary">Åtgärder</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {deals.map((deal) => (
              <TableRow key={deal.id}>
                <TableCell className="font-medium">
                  <div className="flex flex-col max-w-[300px]">
                    <span className="truncate">{deal.title}</span>
                    <span className="text-xs text-muted-foreground">{deal.category} - {deal.city}</span>
                  </div>
                </TableCell>
                <TableCell>{deal.salons?.name || "—"}</TableCell>
                <TableCell>
                  {deal.is_free ? (
                    <Badge variant="secondary">Gratis</Badge>
                  ) : (
                    <span>{formatCurrency(deal.original_price)} kr</span>
                  )}
                </TableCell>
                <TableCell>
                  {deal.is_free ? (
                    <Badge variant="outline">—</Badge>
                  ) : (
                    <span>{formatCurrency(deal.discounted_price)} kr</span>
                  )}
                </TableCell>
                <TableCell>{deal.quantity_left}</TableCell>
                <TableCell>
                  <div className="flex items-center">
                    <Badge variant={
                      deal.status === 'approved' 
                        ? (deal.is_active ? 'default' : 'outline')
                        : deal.status === 'pending' 
                          ? 'secondary' 
                          : 'destructive'
                    }>
                      {deal.status === 'approved' 
                        ? (deal.is_active ? 'Aktiv' : 'Inaktiv')
                        : deal.status === 'pending' 
                          ? 'Väntar' 
                          : 'Nekad'
                      }
                    </Badge>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex justify-end gap-2">
                    {hasViewDetailsAction && onViewDetails && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onViewDetails(deal)}
                        title="Visa detaljer"
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                    )}
                    <DealActions
                      onEdit={onEdit ? () => onEdit(deal) : undefined}
                      onDelete={onDelete ? () => onDelete(deal) : undefined}
                      onToggleActive={onToggleActive ? () => onToggleActive(deal) : undefined}
                    />
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </ScrollArea>
    </Card>
  );
};
