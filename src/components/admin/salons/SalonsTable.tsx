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

export const SalonsTable = ({ 
  salons, 
  onEdit, 
  onDelete, 
  onSelect,
  selectedSalonId 
}: SalonsTableProps) => {
  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[200px]">Namn</TableHead>
            <TableHead className="hidden sm:table-cell">Email</TableHead>
            <TableHead className="hidden md:table-cell">Telefon</TableHead>
            <TableHead className="w-[100px]">Åtgärder</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {salons.map((salon) => (
            <TableRow 
              key={salon.id}
              className={`cursor-pointer transition-colors ${
                selectedSalonId === salon.id 
                  ? "bg-primary/5 hover:bg-primary/10" 
                  : "hover:bg-muted/50"
              }`}
              onClick={() => onSelect(salon)}
            >
              <TableCell className="font-medium">{salon.name}</TableCell>
              <TableCell className="hidden sm:table-cell">{salon.email}</TableCell>
              <TableCell className="hidden md:table-cell">
                {salon.phone || "-"}
              </TableCell>
              <TableCell>
                <SalonActions
                  salonId={salon.id}
                  onEdit={(e) => {
                    e.stopPropagation();
                    onEdit(salon);
                  }}
                  onDelete={(e) => {
                    e.stopPropagation();
                    onDelete(salon);
                  }}
                />
              </TableCell>
            </TableRow>
          ))}
          {salons.length === 0 && (
            <TableRow>
              <TableCell colSpan={4} className="text-center h-24 text-muted-foreground">
                Inga salonger hittades
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
};