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
import { Check, X } from "lucide-react";

interface DealsTableProps {
  deals: Deal[] | undefined;
  onEdit: (deal: Deal) => void;
  onDelete: (deal: Deal) => void;
  showApprovalActions?: boolean;
  onApprove?: (dealId: number) => void;
  onReject?: (dealId: number) => void;
}

export const DealsTable = ({ 
  deals = [], 
  onEdit, 
  onDelete,
  showApprovalActions,
  onApprove,
  onReject,
}: DealsTableProps) => {
  if (!deals || deals.length === 0) {
    return <p className="text-muted-foreground">Inga erbjudanden hittade.</p>;
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
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Titel</TableHead>
          <TableHead>Kategori</TableHead>
          <TableHead>Stad</TableHead>
          <TableHead>Pris</TableHead>
          <TableHead>Salong</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Åtgärder</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {deals.map((deal) => (
          <TableRow key={deal.id}>
            <TableCell>{deal.title}</TableCell>
            <TableCell>{deal.category}</TableCell>
            <TableCell>{deal.city}</TableCell>
            <TableCell>{deal.discounted_price} kr</TableCell>
            <TableCell>{(deal as any).salons?.name || 'Ingen salong'}</TableCell>
            <TableCell>{getStatusBadge(deal.status)}</TableCell>
            <TableCell>
              <div className="flex items-center gap-2">
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
  );
};