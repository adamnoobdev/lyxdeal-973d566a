
import { Salon } from "@/components/admin/types";
import { SalonActions } from "./SalonActions";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { formatDate } from "@/utils/salon/salonDataUtils";
import { Rating } from "@/components/ui/rating";

interface SalonsTableProps {
  salons: Salon[];
  onEdit: (salon: Salon) => void;
  onDelete: (salon: Salon) => void;
  onViewDetails?: (salon: Salon) => void;
  onSelect?: (salon: Salon | null) => void;
  selectedSalon?: Salon | null;
  onRate?: (salon: Salon) => void;
}

export const SalonsTable = ({ 
  salons,
  onEdit,
  onDelete,
  onViewDetails = () => {}, // Default function if not provided
  onSelect,
  selectedSalon,
  onRate
}: SalonsTableProps) => {
  // Handle cell click when onSelect is provided
  const handleRowClick = (salon: Salon) => {
    if (onSelect) {
      onSelect(salon);
    } else if (onViewDetails) {
      onViewDetails(salon);
    }
  };
  
  return (
    <div className="border rounded-md overflow-hidden">
      <Table>
        <TableHeader className="bg-muted/30">
          <TableRow>
            <TableHead>Namn</TableHead>
            <TableHead>Kontakt</TableHead>
            <TableHead>Adress</TableHead>
            <TableHead>Betyg</TableHead>
            <TableHead>Registrerad</TableHead>
            <TableHead className="text-right">Åtgärder</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {salons.length === 0 ? (
            <TableRow>
              <TableCell colSpan={6} className="text-center py-6 text-muted-foreground">
                Inga salonger hittades
              </TableCell>
            </TableRow>
          ) : (
            salons.map(salon => {
              // Debug log for each salon's rating
              console.log(`[SalonsTable] Salon ${salon.name} rating:`, salon.rating);
              
              return (
                <TableRow 
                  key={salon.id} 
                  className={`cursor-pointer hover:bg-muted/50 ${selectedSalon?.id === salon.id ? 'bg-muted/40' : ''}`}
                >
                  <TableCell 
                    className="font-medium"
                    onClick={() => handleRowClick(salon)}
                  >
                    {salon.name}
                  </TableCell>
                  <TableCell onClick={() => handleRowClick(salon)}>
                    <div>
                      <div>{salon.email}</div>
                      <div className="text-sm text-muted-foreground">{salon.phone || "-"}</div>
                    </div>
                  </TableCell>
                  <TableCell onClick={() => handleRowClick(salon)}>
                    {salon.address || "-"}
                  </TableCell>
                  <TableCell onClick={() => handleRowClick(salon)}>
                    {salon.rating ? (
                      <div className="flex items-center gap-2">
                        <Rating value={salon.rating} size="md" />
                        <span className="text-sm font-medium">{salon.rating.toFixed(1)}</span>
                      </div>
                    ) : (
                      <span className="text-muted-foreground text-sm">Ej betygsatt</span>
                    )}
                  </TableCell>
                  <TableCell onClick={() => handleRowClick(salon)}>
                    {salon.created_at ? formatDate(salon.created_at) : "-"}
                  </TableCell>
                  <TableCell className="text-right">
                    <SalonActions 
                      salon={salon} 
                      onEdit={onEdit} 
                      onDelete={onDelete} 
                      onRate={onRate}
                    />
                  </TableCell>
                </TableRow>
              );
            })
          )}
        </TableBody>
      </Table>
    </div>
  );
};
