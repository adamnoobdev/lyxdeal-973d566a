
import { Deal } from "../types";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { DealActions } from "./DealActions";
import { Badge } from "@/components/ui/badge";
import { Check, X, Power } from "lucide-react";

interface DealsTableProps {
  deals: Deal[] | undefined;
  onEdit: (deal: Deal) => void;
  onDelete: (deal: Deal) => void;
  onToggleActive?: (deal: Deal) => void;
  showApprovalActions?: boolean;
  onApprove?: (dealId: number) => void;
  onReject?: (dealId: number) => void;
}

export const DealsTable = ({ 
  deals = [], 
  onEdit, 
  onDelete,
  onToggleActive,
  showApprovalActions,
  onApprove,
  onReject,
}: DealsTableProps) => {
  if (!deals || deals.length === 0) {
    return <p className="text-muted-foreground p-4">Inga erbjudanden hittade.</p>;
  }

  const getStatusBadge = (status: string) => {
    const variants: Record<string, { variant: "default" | "destructive" | "outline" | "secondary", label: string }> = {
      pending: { variant: "secondary", label: "Väntar" },
      approved: { variant: "default", label: "Godkänd" },
      rejected: { variant: "destructive", label: "Nekad" }
    };

    const { variant, label } = variants[status] || variants.pending;
    return <Badge variant={variant}>{label}</Badge>;
  };

  return (
    <div className="w-full overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="min-w-[200px]">Titel</TableHead>
            <TableHead className="min-w-[120px]">Kategori</TableHead>
            <TableHead className="min-w-[120px]">Stad</TableHead>
            <TableHead className="min-w-[100px]">Pris</TableHead>
            <TableHead className="min-w-[150px]">Salong</TableHead>
            <TableHead className="min-w-[100px]">Status</TableHead>
            <TableHead className="min-w-[100px]">Aktivitet</TableHead>
            <TableHead className="min-w-[200px]">Åtgärder</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {deals.map((deal) => (
            <TableRow key={deal.id} className={!deal.is_active ? "bg-muted/50" : undefined}>
              <TableCell className="font-medium">{deal.title}</TableCell>
              <TableCell>{deal.category}</TableCell>
              <TableCell>{deal.city}</TableCell>
              <TableCell>{deal.discounted_price} kr</TableCell>
              <TableCell>{(deal as any).salons?.name || 'Ingen salong'}</TableCell>
              <TableCell>{getStatusBadge(deal.status)}</TableCell>
              <TableCell>
                <Badge variant={deal.is_active ? "default" : "outline"}>
                  {deal.is_active ? "Aktiv" : "Inaktiv"}
                </Badge>
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-2 flex-wrap">
                  {showApprovalActions && deal.status === 'pending' && (
                    <>
                      <Button
                        variant="outline"
                        size="sm"
                        className="h-8 w-8 p-0"
                        onClick={() => onApprove?.(deal.id)}
                      >
                        <Check className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="h-8 w-8 p-0"
                        onClick={() => onReject?.(deal.id)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </>
                  )}
                  {onToggleActive && (
                    <Button
                      variant="outline"
                      size="sm"
                      className="h-8 w-8 p-0"
                      onClick={() => onToggleActive(deal)}
                      title={deal.is_active ? "Inaktivera erbjudande" : "Aktivera erbjudande"}
                    >
                      <Power className={`h-4 w-4 ${deal.is_active ? 'text-green-500' : 'text-gray-400'}`} />
                    </Button>
                  )}
                  <DealActions
                    onEdit={() => onEdit(deal)}
                    onDelete={() => onDelete(deal)}
                  />
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};
