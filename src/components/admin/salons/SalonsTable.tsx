
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
import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";

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
    <Card className="border border-secondary/20 rounded-lg overflow-hidden shadow-sm">
      <ScrollArea className="h-full max-h-[70vh]">
        <div className="w-full">
          <Table>
            <TableHeader className="bg-primary/5 sticky top-0 z-10">
              <TableRow>
                <TableHead className="min-w-[200px] font-semibold text-primary">Namn</TableHead>
                <TableHead className="min-w-[200px] font-semibold text-primary">Email</TableHead>
                <TableHead className="min-w-[150px] font-semibold text-primary">Telefon</TableHead>
                <TableHead className="min-w-[100px] text-center font-semibold text-primary">Åtgärder</TableHead>
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
                  <TableCell>{salon.email}</TableCell>
                  <TableCell>
                    {salon.phone || "-"}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center justify-center">
                      <SalonActions
                        salonId={salon.id}
                        onEdit={(e: React.MouseEvent) => {
                          e.stopPropagation();
                          onEdit(salon);
                        }}
                        onDelete={(e: React.MouseEvent) => {
                          e.stopPropagation();
                          onDelete(salon);
                        }}
                      />
                    </div>
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
      </ScrollArea>
    </Card>
  );
};
