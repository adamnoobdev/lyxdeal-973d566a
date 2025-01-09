import { Salon } from "../types";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { SalonActions } from "./SalonActions";

interface SalonsTableProps {
  salons: Salon[];
  onEdit: (salon: Salon) => void;
  onDelete: (salon: Salon) => void;
}

export const SalonsTable = ({ salons, onEdit, onDelete }: SalonsTableProps) => {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Namn</TableHead>
          <TableHead>Email</TableHead>
          <TableHead>Telefon</TableHead>
          <TableHead>Adress</TableHead>
          <TableHead>Åtgärder</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {salons.map((salon) => (
          <TableRow key={salon.id}>
            <TableCell>{salon.name}</TableCell>
            <TableCell>{salon.email}</TableCell>
            <TableCell>{salon.phone || "-"}</TableCell>
            <TableCell>{salon.address || "-"}</TableCell>
            <TableCell>
              <SalonActions
                onEdit={() => onEdit(salon)}
                onDelete={() => onDelete(salon)}
              />
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};