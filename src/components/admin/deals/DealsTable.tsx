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

interface DealsTableProps {
  deals: Deal[];
  onEdit: (deal: Deal) => void;
  onDelete: (deal: Deal) => void;
}

export const DealsTable = ({ deals, onEdit, onDelete }: DealsTableProps) => {
  return (
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
        {deals.map((deal) => (
          <TableRow key={deal.id}>
            <TableCell>{deal.title}</TableCell>
            <TableCell>{deal.category}</TableCell>
            <TableCell>{deal.city}</TableCell>
            <TableCell>{deal.discountedPrice} kr</TableCell>
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
  );
};