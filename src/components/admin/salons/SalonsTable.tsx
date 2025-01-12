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
  onSelect: (salon: Salon) => void;
  selectedSalonId?: number;
}

export const SalonsTable = ({ salons, onEdit, onDelete, onSelect, selectedSalonId }: SalonsTableProps) => {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Namn</TableHead>
          <TableHead>Email</TableHead>
          <TableHead>Åtgärder</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {salons.map((salon) => (
          <TableRow 
            key={salon.id}
            className={`cursor-pointer hover:bg-accent/50 transition-colors ${
              selectedSalonId === salon.id ? "bg-accent" : ""
            }`}
            onClick={() => onSelect(salon)}
          >
            <TableCell>{salon.name}</TableCell>
            <TableCell>{salon.email}</TableCell>
            <TableCell>
              <SalonActions
                salonId={salon.id}
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