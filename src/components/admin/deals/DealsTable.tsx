
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
    const variants: Record<string, { variant: "default" | "destructive" | "outline" | "secondary", label: string }> = {
      pending: { variant: "secondary", label: "Väntar" },
      approved: { variant: "default", label: "Godkänd" },
      rejected: { variant: "destructive", label: "Nekad" }
    };

    const { variant, label } = variants[status] || variants.pending;
    return <Badge variant={variant}>{label}</Badge>;
  };

  return (
    <div className="w-full overflow-auto rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="min-w-[200px]">Titel</TableHead>
            <TableHead className="hidden md:table-cell">Kategori</TableHead>
            <TableHead className="hidden md:table-cell">Stad</TableHead>
            <TableHead>Pris</TableHead>
            <TableHead className="hidden md:table-cell">Salong</TableHead>
            <TableHead className="hidden sm:table-cell">Status</TableHead>
            <TableHead className="hidden xs:table-cell">Aktivitet</TableHead>
            <TableHead>Åtgärder</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {deals.map((deal) => (
            <TableRow 
              key={deal.id} 
              className={!deal.is_active ? "bg-muted/50" : undefined}
            >
              <TableCell className="font-medium">
                <div className="flex items-center gap-2">
                  <div 
                    className={`w-2 h-2 rounded-full ${deal.is_active ? 'bg-green-500' : 'bg-gray-400'}`} 
                    title={deal.is_active ? 'Aktiv' : 'Inaktiv'}
                  />
                  <span className="truncate max-w-[150px] md:max-w-[250px]">{deal.title}</span>
                </div>
              </TableCell>
              <TableCell className="hidden md:table-cell">{deal.category}</TableCell>
              <TableCell className="hidden md:table-cell">{deal.city}</TableCell>
              <TableCell>
                {deal.is_free ? (
                  <Badge variant="secondary">Gratis</Badge>
                ) : (
                  <span className="whitespace-nowrap">{formatCurrency(deal.discounted_price)} kr</span>
                )}
              </TableCell>
              <TableCell className="hidden md:table-cell">{(deal as any).salons?.name || 'Ingen salong'}</TableCell>
              <TableCell className="hidden sm:table-cell">{getStatusBadge(deal.status)}</TableCell>
              <TableCell className="hidden xs:table-cell">
                <Badge 
                  variant={deal.is_active ? "default" : "outline"}
                  className={`${deal.is_active ? 'bg-green-100 text-green-800 hover:bg-green-200' : 'text-gray-500'}`}
                >
                  {deal.is_active ? "Aktiv" : "Inaktiv"}
                </Badge>
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-1 flex-wrap">
                  {showApprovalActions && deal.status === 'pending' && (
                    <>
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => onApprove?.(deal.id)}
                        title="Godkänn"
                      >
                        <Check className="h-4 w-4 text-green-600" />
                      </Button>
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-8 w-8"
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
                      className="h-8 w-8"
                      onClick={() => onToggleActive(deal)}
                      title={deal.is_active ? "Inaktivera" : "Aktivera"}
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
