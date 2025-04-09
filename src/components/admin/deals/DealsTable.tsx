
import {
  ChevronDown,
  ChevronUp,
  CircleDollarSign,
  Copy,
  Edit,
  Eye,
  MoreHorizontal,
  Trash2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Deal } from "@/types/deal";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { DealActions } from "./DealActions";

interface DealsTableProps {
  deals: Deal[];
  onEdit?: (deal: Deal) => void;
  onDelete?: (deal: Deal) => void;
  onToggleActive?: (deal: Deal) => Promise<boolean | void>;
  onViewDiscountCodes?: (deal: Deal) => void;
  onGenerateDiscountCodes?: (deal: Deal, quantity?: number) => Promise<void>;
  isGeneratingCodes?: boolean;
  onPreview?: (deal: Deal) => void;
  isSalonView?: boolean;
  renderActions?: (deal: Deal) => {
    onPreview?: () => void;
    onEdit?: () => void;
    onApprove?: () => Promise<void>;
    onReject?: () => Promise<void>;
  };
}

export const DealsTable: React.FC<DealsTableProps> = ({
  deals,
  onEdit,
  onDelete,
  onToggleActive,
  onViewDiscountCodes,
  onGenerateDiscountCodes,
  isGeneratingCodes,
  renderActions,
  onPreview,
  isSalonView
}) => {
  const [sortBy, setSortBy] = useState<keyof Deal | null>(null);
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");

  const handleSort = (column: keyof Deal) => {
    if (sortBy === column) {
      // Toggle sort order if the same column is clicked again
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      // Set the new column and default sort order to ascending
      setSortBy(column);
      setSortOrder("asc");
    }
  };

  const sortedDeals = [...deals].sort((a, b) => {
    if (sortBy) {
      const aValue = a[sortBy];
      const bValue = b[sortBy];

      if (typeof aValue === "string" && typeof bValue === "string") {
        return sortOrder === "asc"
          ? aValue.localeCompare(bValue)
          : bValue.localeCompare(aValue);
      } else if (typeof aValue === "number" && typeof bValue === "number") {
        return sortOrder === "asc" ? aValue - bValue : bValue - aValue;
      }
      return 0;
    }
    return 0;
  });

  // Show the status column based on deal status values
  const showStatusColumn = deals.some(deal => deal.status === 'pending' || deal.status === 'rejected');

  return (
    <Table>
      <TableCaption>Alla erbjudanden</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead>
            <Button variant="ghost" onClick={() => handleSort("title")}>
              Title
              {sortBy === "title" && (
                <span className="ml-2 h-4 w-4">
                  {sortOrder === "asc" ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                </span>
              )}
            </Button>
          </TableHead>
          <TableHead>
            <Button variant="ghost" onClick={() => handleSort("category")}>
              Kategori
              {sortBy === "category" && (
                <span className="ml-2 h-4 w-4">
                  {sortOrder === "asc" ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                </span>
              )}
            </Button>
          </TableHead>
          <TableHead>
            <Button variant="ghost" onClick={() => handleSort("city")}>
              Stad
              {sortBy === "city" && (
                <span className="ml-2 h-4 w-4">
                  {sortOrder === "asc" ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                </span>
              )}
            </Button>
          </TableHead>
          <TableHead className="text-right">Pris</TableHead>
          <TableHead className="text-center">Status</TableHead>
          {showStatusColumn && (
            <TableHead className="text-center">Godkännande</TableHead>
          )}
          <TableHead className="text-right">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {sortedDeals.map((deal) => (
          <TableRow key={deal.id}>
            <TableCell className="font-medium">{deal.title}</TableCell>
            <TableCell>{deal.category}</TableCell>
            <TableCell>{deal.city}</TableCell>
            <TableCell className="text-right">{deal.discounted_price} kr</TableCell>
            <TableCell className="text-center">{deal.is_active ? "Aktiv" : "Inaktiv"}</TableCell>
            {showStatusColumn && (
              <TableCell className="text-center">
                <span className={cn(
                  "px-2 py-1 rounded text-xs font-medium",
                  deal.status === 'pending' ? "bg-amber-100 text-amber-800" :
                  deal.status === 'approved' ? "bg-green-100 text-green-800" :
                  deal.status === 'rejected' ? "bg-red-100 text-red-800" : ""
                )}>
                  {deal.status === 'pending' ? 'Väntande' : 
                   deal.status === 'approved' ? 'Godkänd' : 
                   deal.status === 'rejected' ? 'Nekad' : ''}
                </span>
              </TableCell>
            )}
            {/* Actions cell */}
            <TableCell className="text-right w-32 sm:w-48 pr-3 whitespace-nowrap">
              <DealActions
                onEdit={onEdit ? () => onEdit(deal) : undefined}
                onDelete={onDelete ? () => onDelete(deal) : undefined}
                onToggleActive={onToggleActive ? () => onToggleActive(deal) : undefined}
                isActive={deal.is_active}
                onPreview={onPreview ? () => onPreview(deal) : renderActions?.(deal)?.onPreview}
                onApprove={renderActions?.(deal)?.onApprove}
                onReject={renderActions?.(deal)?.onReject}
                onViewDiscountCodes={onViewDiscountCodes ? () => onViewDiscountCodes(deal) : undefined}
                onGenerateDiscountCodes={onGenerateDiscountCodes ? () => onGenerateDiscountCodes(deal) : undefined}
                isGeneratingCodes={isGeneratingCodes}
                showViewCodesForSalon={isSalonView}
              />
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};
