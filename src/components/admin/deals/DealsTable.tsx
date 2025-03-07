
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
import { Check, X, Power, Eye } from "lucide-react";
import { formatCurrency } from "@/utils/dealApiUtils";
import { Card } from "@/components/ui/card";

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
    return <p className="text-muted-foreground p-4 text-center">Inga erbjudanden hittade.</p>;
  }

  const getStatusBadge = (status: string) => {
    const variants: Record<string, { variant: "default" | "destructive" | "outline" | "secondary", label: string, color: string }> = {
      pending: { variant: "secondary", label: "Väntar", color: "bg-amber-100 text-amber-800 border-amber-200" },
      approved: { variant: "default", label: "Godkänd", color: "bg-green-100 text-green-800 border-green-200" },
      rejected: { variant: "destructive", label: "Nekad", color: "" }
    };

    const { variant, label, color } = variants[status] || variants.pending;
    return (
      <Badge variant={variant} className={color}>
        {label}
      </Badge>
    );
  };

  return (
    <Card className="border border-secondary/20 rounded-lg overflow-hidden shadow-sm">
      <div className="w-full overflow-auto">
        <Table>
          <TableHeader className="bg-primary/5">
            <TableRow>
              <TableHead className="min-w-[200px] font-semibold text-primary">Titel</TableHead>
              <TableHead className="hidden md:table-cell font-semibold text-primary">Kategori</TableHead>
              <TableHead className="hidden md:table-cell font-semibold text-primary">Stad</TableHead>
              <TableHead className="font-semibold text-primary">Pris</TableHead>
              <TableHead className="hidden md:table-cell font-semibold text-primary">Salong</TableHead>
              <TableHead className="hidden sm:table-cell font-semibold text-primary">Status</TableHead>
              <TableHead className="text-center font-semibold text-primary">Åtgärder</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {deals.map((deal) => (
              <TableRow 
                key={deal.id} 
                className={`${!deal.is_active ? "bg-gray-50" : "hover:bg-primary/5"} transition-colors`}
              >
                <TableCell className="font-medium">
                  <div className="flex items-center gap-2">
                    <div 
                      className={`w-3 h-3 rounded-full ${deal.is_active ? 'bg-green-500' : 'bg-gray-400'}`} 
                      title={deal.is_active ? 'Aktiv' : 'Inaktiv'}
                    />
                    <span className="truncate max-w-[150px] md:max-w-[250px]">{deal.title}</span>
                  </div>
                </TableCell>
                <TableCell className="hidden md:table-cell text-muted-foreground">{deal.category}</TableCell>
                <TableCell className="hidden md:table-cell text-muted-foreground">{deal.city}</TableCell>
                <TableCell>
                  {deal.is_free ? (
                    <Badge variant="secondary" className="bg-secondary/30 text-primary border-secondary/40">Gratis</Badge>
                  ) : (
                    <span className="font-medium text-primary">{formatCurrency(deal.discounted_price)} kr</span>
                  )}
                </TableCell>
                <TableCell className="hidden md:table-cell text-muted-foreground">{(deal as any).salons?.name || 'Ingen salong'}</TableCell>
                <TableCell className="hidden sm:table-cell">{getStatusBadge(deal.status)}</TableCell>
                <TableCell>
                  <div className="flex items-center justify-center gap-1">
                    {showApprovalActions && deal.status === 'pending' && (
                      <>
                        <Button
                          variant="outline"
                          size="icon"
                          className="h-8 w-8 bg-green-50 border-green-200 hover:bg-green-100 hover:text-green-700"
                          onClick={() => onApprove?.(deal.id)}
                          title="Godkänn"
                        >
                          <Check className="h-4 w-4 text-green-600" />
                        </Button>
                        <Button
                          variant="outline"
                          size="icon"
                          className="h-8 w-8 bg-red-50 border-red-200 hover:bg-red-100 hover:text-red-700"
                          onClick={() => onReject?.(deal.id)}
                          title="Neka"
                        >
                          <X className="h-4 w-4 text-red-600" />
                        </Button>
                      </>
                    )}
                    
                    {onToggleActive && (
                      <Button
                        variant="outline"
                        size="icon"
                        className={`h-8 w-8 ${deal.is_active ? 'bg-primary/10 border-primary/20 hover:bg-primary/20' : 'bg-gray-50 border-gray-200 hover:bg-gray-100'}`}
                        onClick={() => onToggleActive(deal)}
                        title={deal.is_active ? "Inaktivera" : "Aktivera"}
                      >
                        <Power className={`h-4 w-4 ${deal.is_active ? 'text-primary' : 'text-gray-400'}`} />
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
    </Card>
  );
};
