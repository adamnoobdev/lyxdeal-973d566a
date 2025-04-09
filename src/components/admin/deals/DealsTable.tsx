import {
  CaretSort,
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
  renderActions
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

  return (
    <Table>
      <TableCaption>Alla erbjudanden</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead>
            <Button variant="ghost" onClick={() => handleSort("title")}>
              Title
              {sortBy === "title" && (
                <CaretSort direction={sortOrder} className="ml-2 h-4 w-4" />
              )}
            </Button>
          </TableHead>
          <TableHead>
            <Button variant="ghost" onClick={() => handleSort("category")}>
              Kategori
              {sortBy === "category" && (
                <CaretSort direction={sortOrder} className="ml-2 h-4 w-4" />
              )}
            </Button>
          </TableHead>
          <TableHead>
            <Button variant="ghost" onClick={() => handleSort("city")}>
              Stad
              {sortBy === "city" && (
                <CaretSort direction={sortOrder} className="ml-2 h-4 w-4" />
              )}
            </Button>
          </TableHead>
          <TableHead className="text-right">Pris</TableHead>
          <TableHead className="text-center">Status</TableHead>
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
            {/* Actions cell */}
            <TableCell className="text-right w-32 sm:w-48 pr-3 whitespace-nowrap">
              <DealActions
                onEdit={onEdit ? () => onEdit(deal) : undefined}
                onDelete={onDelete ? () => onDelete(deal) : undefined}
                onToggleActive={onToggleActive ? () => onToggleActive(deal) : undefined}
                isActive={deal.is_active}
                onPreview={renderActions?.(deal)?.onPreview}
                onApprove={renderActions?.(deal)?.onApprove}
                onReject={renderActions?.(deal)?.onReject}
                onViewDiscountCodes={onViewDiscountCodes ? () => onViewDiscountCodes(deal) : undefined}
                onGenerateDiscountCodes={onGenerateDiscountCodes ? () => onGenerateDiscountCodes(deal) : undefined}
                isGeneratingCodes={isGeneratingCodes}
              />
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};
