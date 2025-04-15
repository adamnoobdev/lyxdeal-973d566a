
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { format } from "date-fns";
import { Eye, Star } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Salon } from "../types";
import { SalonActions } from "./SalonActions";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";

interface SalonsTableProps {
  salons: Salon[];
  onEdit: (salon: Salon) => void;
  onDelete: (salon: Salon) => void;
  onSelect?: (salon: Salon | null) => void;
  selectedSalon?: Salon | null;
  onRate?: (salon: Salon) => void;
}

export const SalonsTable = ({
  salons,
  onEdit,
  onDelete,
  onSelect,
  selectedSalon,
  onRate
}: SalonsTableProps) => {
  const navigate = useNavigate();

  // Handle view salon details
  const handleViewSalon = (id: number) => {
    navigate(`/admin/salons/${id}`);
  };

  return (
    <div className="relative w-full overflow-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[250px]">Namn</TableHead>
            <TableHead>E-post</TableHead>
            <TableHead>Adress</TableHead>
            <TableHead>Skapad</TableHead>
            <TableHead>Betyg</TableHead>
            <TableHead>Villkor</TableHead>
            <TableHead className="text-right">Åtgärder</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {salons.length === 0 ? (
            <TableRow>
              <TableCell colSpan={7} className="h-24 text-center">
                Inga salonger hittades.
              </TableCell>
            </TableRow>
          ) : (
            salons.map((salon) => {
              // Log the rating for debugging purposes
              console.log(`[SalonsTable] Salon ${salon.name} rating:`, salon.rating);
              
              return (
                <TableRow
                  key={salon.id}
                  className={
                    selectedSalon?.id === salon.id
                      ? "bg-muted/40"
                      : "hover:bg-muted/30"
                  }
                  onClick={() => onSelect?.(salon)}
                >
                  <TableCell className="font-medium">
                    <div className="flex flex-col">
                      <span>{salon.name}</span>
                      <span className="text-xs text-muted-foreground">
                        ID: {salon.id}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>{salon.email}</TableCell>
                  <TableCell>
                    <span className="max-w-[200px] line-clamp-1">
                      {salon.address || "—"}
                    </span>
                  </TableCell>
                  <TableCell>
                    {salon.created_at
                      ? format(
                          new Date(salon.created_at),
                          "yyyy-MM-dd"
                        )
                      : "—"}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      {salon.rating !== null ? (
                        <>
                          <Star
                            className="h-4 w-4 fill-yellow-400 text-yellow-400"
                            strokeWidth={1}
                          />
                          <span>{salon.rating}</span>
                        </>
                      ) : (
                        <span className="text-muted-foreground">
                          Inte betygsatt
                        </span>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-1">
                      {salon.terms_accepted ? (
                        <Badge variant="outline" className="border-green-500/20 bg-green-500/10 text-green-600">
                          Villkor
                        </Badge>
                      ) : (
                        <Badge variant="outline" className="border-red-500/20 bg-red-500/10 text-red-600">
                          Villkor
                        </Badge>
                      )}

                      {salon.privacy_accepted ? (
                        <Badge variant="outline" className="border-green-500/20 bg-green-500/10 text-green-600">
                          Integritet
                        </Badge>
                      ) : (
                        <Badge variant="outline" className="border-red-500/20 bg-red-500/10 text-red-600">
                          Integritet
                        </Badge>
                      )}
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleViewSalon(salon.id);
                        }}
                      >
                        <Eye className="h-4 w-4" />
                        <span className="sr-only">Visa</span>
                      </Button>
                      <SalonActions
                        salon={salon}
                        onEdit={onEdit}
                        onDelete={onDelete}
                        onRate={onRate}
                      />
                    </div>
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
