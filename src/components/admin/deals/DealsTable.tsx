
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
    <div className="rounded-xl overflow-hidden border bg-white shadow-sm">
      <ScrollArea className="w-full max-w-full">
        <Table>
          <TableHeader className="bg-slate-50/80 sticky top-0 z-10">
            <TableRow className="hover:bg-transparent">
              <TableHead className="w-[300px] font-medium text-primary">Titel</TableHead>
              <TableHead className="w-[200px] font-medium text-primary">Salong</TableHead>
              <TableHead className="w-[120px] font-medium text-primary">Pris</TableHead>
              <TableHead className="w-[120px] font-medium text-primary">Rabatterat</TableHead>
              <TableHead className="w-[100px] font-medium text-primary">Status</TableHead>
              <TableHead className="w-[100px] text-right font-medium text-primary">Åtgärder</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {deals.map((deal) => (
              <TableRow 
                key={deal.id} 
                className="hover:bg-slate-50/80 transition-colors"
              >
                <TableCell>
                  <div className="flex flex-col max-w-[300px]">
                    <span className="font-medium text-primary">{deal.title}</span>
                    <span className="text-sm text-gray-500">{deal.category} - {deal.city}</span>
                  </div>
                </TableCell>
                <TableCell className="text-gray-600">{deal.salons?.name || "—"}</TableCell>
                <TableCell>
                  {deal.is_free ? (
                    <Badge variant="secondary" className="bg-gray-100 text-gray-600">Gratis</Badge>
                  ) : (
                    <span className="text-gray-600">{formatCurrency(deal.original_price)} kr</span>
                  )}
                </TableCell>
                <TableCell>
                  {deal.is_free ? (
                    <Badge variant="outline" className="text-gray-400">—</Badge>
                  ) : (
                    <span className="text-primary font-medium">{formatCurrency(deal.discounted_price)} kr</span>
                  )}
                </TableCell>
                <TableCell>
                  <Badge 
                    variant={
                      deal.status === 'approved' 
                        ? (deal.is_active ? 'default' : 'secondary')
                        : deal.status === 'pending' 
                          ? 'outline' 
                          : 'destructive'
                    }
                    className={
                      deal.status === 'approved' && deal.is_active
                        ? 'bg-green-100 text-green-700 hover:bg-green-100'
                        : deal.status === 'pending'
                          ? 'bg-amber-50 text-amber-600 border-amber-200'
                          : ''
                    }
                  >
                    {deal.status === 'approved' 
                      ? (deal.is_active ? 'Aktiv' : 'Inaktiv')
                      : deal.status === 'pending' 
                        ? 'Väntar' 
                        : 'Nekad'
                    }
                  </Badge>
                </TableCell>
                <TableCell>
                  <div className="flex justify-end gap-2">
                    {hasViewDetailsAction && onViewDetails && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onViewDetails(deal)}
                        title="Visa detaljer"
                        className="hover:bg-primary/10"
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
            {deals.length === 0 && (
              <TableRow>
                <TableCell colSpan={6} className="h-24 text-center text-muted-foreground">
                  Inga erbjudanden hittades
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </ScrollArea>
    </div>
  );
};
