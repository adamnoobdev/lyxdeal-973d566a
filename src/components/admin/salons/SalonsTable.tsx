
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Salon } from "../types";
import { SalonActions } from "./SalonActions";
import { CheckCircle, XCircle } from "lucide-react";

interface SalonsTableProps {
  salons: Salon[];
  onDelete: (salon: Salon) => void;
  onEdit: (salon: Salon) => void;
  onSelect: (salon: Salon) => void;
  selectedSalon: Salon | null;
}

export const SalonsTable = ({ 
  salons, 
  onDelete, 
  onEdit, 
  onSelect, 
  selectedSalon 
}: SalonsTableProps) => {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('sv-SE', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div className="border rounded-md">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>ID</TableHead>
            <TableHead>Namn</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Roll</TableHead>
            <TableHead>Skapad</TableHead>
            <TableHead>Villkor</TableHead>
            <TableHead>Integritet</TableHead>
            <TableHead className="text-right">Hantera</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {salons.map((salon) => (
            <TableRow 
              key={salon.id} 
              className={`cursor-pointer ${selectedSalon?.id === salon.id ? 'bg-muted/50' : ''}`}
              onClick={() => onSelect(salon)}
            >
              <TableCell className="font-medium">{salon.id}</TableCell>
              <TableCell>{salon.name}</TableCell>
              <TableCell>{salon.email}</TableCell>
              <TableCell>{salon.role === 'admin' ? 'Admin' : 'Salongägare'}</TableCell>
              <TableCell>{formatDate(salon.created_at)}</TableCell>
              <TableCell>
                {salon.terms_accepted !== false ? (
                  <CheckCircle className="h-5 w-5 text-green-500" />
                ) : (
                  <XCircle className="h-5 w-5 text-red-500" />
                )}
              </TableCell>
              <TableCell>
                {salon.privacy_accepted !== false ? (
                  <CheckCircle className="h-5 w-5 text-green-500" />
                ) : (
                  <XCircle className="h-5 w-5 text-red-500" />
                )}
              </TableCell>
              <TableCell className="text-right">
                <SalonActions
                  salon={salon}
                  onDelete={() => onDelete(salon)}
                  onEdit={() => onEdit(salon)}
                />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};
