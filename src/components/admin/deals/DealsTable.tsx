
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
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { formatCurrency } from "@/utils/dealApiUtils";

interface DealsTableProps {
  deals: Deal[];
  onEdit?: (deal: Deal) => void;
  onDelete?: (deal: Deal) => void;
  onToggleActive?: ((deal: Deal) => Promise<void>) | undefined;
  onPreview?: (deal: Deal) => void;
  showApprovalActions?: boolean;
  onApprove?: (dealId: number) => Promise<void>;
  onReject?: (dealId: number) => Promise<void>;
  hasViewDetailsAction?: boolean;
  onViewDetails?: (deal: Deal) => void;
  onViewDiscountCodes?: (deal: Deal) => void;
  onGenerateDiscountCodes?: (deal: Deal, quantity?: number) => Promise<void>;
  isGeneratingCodes?: boolean;
}

export const DealsTable = ({ 
  deals, 
  onEdit, 
  onDelete, 
  onToggleActive,
  onPreview,
  showApprovalActions,
  onApprove,
  onReject,
  hasViewDetailsAction,
  onViewDetails,
  onViewDiscountCodes,
  onGenerateDiscountCodes,
  isGeneratingCodes
}: DealsTableProps) => {
  const handlePreviewDeal = (deal: Deal) => {
    if (onPreview) {
      onPreview(deal);
    } else if (onViewDetails && hasViewDetailsAction) {
      onViewDetails(deal);
    } else {
      // Fallback to opening the deal in a new tab
      window.open(`/deals/${deal.id}`, '_blank');
    }
  };

  return (
    <div className="rounded-lg overflow-hidden border border-secondary/10 bg-white">
      <ScrollArea className="w-full max-w-full overflow-auto">
        <div className="min-w-[640px]">
          <Table>
            <TableHeader className="bg-gray-50">
              <TableRow>
                <TableHead className="min-w-[180px] font-medium text-primary">Titel</TableHead>
                <TableHead className="min-w-[120px] font-medium text-primary hidden md:table-cell">Salong</TableHead>
                <TableHead className="min-w-[90px] font-medium text-primary">Pris</TableHead>
                <TableHead className="min-w-[100px] font-medium text-primary hidden sm:table-cell">Rabatterat</TableHead>
                <TableHead className="min-w-[60px] font-medium text-primary hidden md:table-cell">Kvar</TableHead>
                <TableHead className="min-w-[80px] font-medium text-primary">Status</TableHead>
                <TableHead className="min-w-[80px] text-right font-medium text-primary">Åtgärder</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {deals.map((deal) => (
                <TableRow key={deal.id} className="border-b border-gray-100">
                  <TableCell className="font-medium">
                    <div className="flex flex-col max-w-[200px] sm:max-w-[250px] md:max-w-[300px]">
                      <span className="truncate font-medium">{deal.title}</span>
                      <span className="text-xs text-muted-foreground truncate">{deal.category} - {deal.city}</span>
                    </div>
                  </TableCell>
                  <TableCell className="hidden md:table-cell">{deal.salons?.name || "—"}</TableCell>
                  <TableCell>
                    <span>{formatCurrency(deal.original_price)} kr</span>
                  </TableCell>
                  <TableCell className="hidden sm:table-cell">
                    <span className="text-primary font-medium">
                      {deal.is_free || deal.discounted_price === 0 ? "Gratis" : `${formatCurrency(deal.discounted_price)} kr`}
                    </span>
                  </TableCell>
                  <TableCell className="hidden md:table-cell">
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <span>{deal.quantity_left}</span>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Antal rabattkoder kvar</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </TableCell>
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
                    <div className="flex justify-end">
                      <DealActions
                        onEdit={onEdit ? () => onEdit(deal) : undefined}
                        onDelete={onDelete ? () => onDelete(deal) : undefined}
                        onToggleActive={onToggleActive ? () => onToggleActive(deal) : undefined}
                        isActive={deal.is_active}
                        onPreview={() => handlePreviewDeal(deal)}
                        onApprove={showApprovalActions && onApprove ? () => onApprove(deal.id) : undefined}
                        onReject={showApprovalActions && onReject ? () => onReject(deal.id) : undefined}
                        onViewDiscountCodes={onViewDiscountCodes ? () => onViewDiscountCodes(deal) : undefined}
                        onGenerateDiscountCodes={onGenerateDiscountCodes ? () => onGenerateDiscountCodes(deal) : undefined}
                        isGeneratingCodes={isGeneratingCodes}
                      />
                    </div>
                  </TableCell>
                </TableRow>
              ))}
              {deals.length === 0 && (
                <TableRow>
                  <TableCell colSpan={7} className="text-center h-24 text-muted-foreground">
                    Inga erbjudanden hittades
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </ScrollArea>
    </div>
  );
};
