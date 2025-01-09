import { PriceDisplay } from "@/components/PriceDisplay";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Deal } from "../types";
import { DealActions } from "./DealActions";

interface DealsTableProps {
  deals: Deal[];
  onEdit: (deal: Deal) => void;
  onDelete: (deal: Deal) => void;
}

export const DealsTable = ({ deals, onEdit, onDelete }: DealsTableProps) => {
  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Titel</TableHead>
            <TableHead>Kategori</TableHead>
            <TableHead>Stad</TableHead>
            <TableHead>Pris</TableHead>
            <TableHead>Åtgärder</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {deals?.map((deal) => (
            <TableRow key={deal.id}>
              <TableCell>{deal.title}</TableCell>
              <TableCell>{deal.category}</TableCell>
              <TableCell>{deal.city}</TableCell>
              <TableCell>
                <PriceDisplay
                  originalPrice={deal.originalPrice}
                  discountedPrice={deal.discountedPrice}
                />
              </TableCell>
              <TableCell>
                <DealActions
                  onEdit={() => onEdit(deal)}
                  onDelete={() => onDelete(deal)}
                />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};