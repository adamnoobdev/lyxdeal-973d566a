
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
import { useState, useEffect } from "react";

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

  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div className="border rounded-md overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-12 font-medium text-xs sm:text-sm">ID</TableHead>
            <TableHead className="font-medium text-xs sm:text-sm">Namn</TableHead>
            {!isMobile && <TableHead className="font-medium text-xs sm:text-sm hidden md:table-cell">Email</TableHead>}
            {!isMobile && <TableHead className="font-medium text-xs sm:text-sm hidden sm:table-cell">Roll</TableHead>}
            {!isMobile && <TableHead className="font-medium text-xs sm:text-sm hidden lg:table-cell">Skapad</TableHead>}
            <TableHead className="font-medium text-xs sm:text-sm w-16 hidden sm:table-cell">Villkor</TableHead>
            <TableHead className="font-medium text-xs sm:text-sm w-16 hidden sm:table-cell">Integritet</TableHead>
            <TableHead className="text-right font-medium text-xs sm:text-sm">Hantera</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {salons.map((salon) => (
            <TableRow 
              key={salon.id} 
              className={`cursor-pointer ${selectedSalon?.id === salon.id ? 'bg-muted/50' : ''}`}
              onClick={() => onSelect(salon)}
            >
              <TableCell className="font-medium text-xs sm:text-sm py-2 sm:py-4">{salon.id}</TableCell>
              <TableCell className="text-xs sm:text-sm py-2 sm:py-4 max-w-[120px] md:max-w-none">
                <div className="truncate">{salon.name}</div>
                {isMobile && (
                  <div className="text-muted-foreground text-[10px] truncate mt-1">
                    {salon.email}
                  </div>
                )}
              </TableCell>
              {!isMobile && <TableCell className="text-xs sm:text-sm py-2 sm:py-4 hidden md:table-cell">{salon.email}</TableCell>}
              {!isMobile && <TableCell className="text-xs sm:text-sm py-2 sm:py-4 hidden sm:table-cell">{salon.role === 'admin' ? 'Admin' : 'Salongägare'}</TableCell>}
              {!isMobile && <TableCell className="text-xs sm:text-sm py-2 sm:py-4 hidden lg:table-cell">{formatDate(salon.created_at)}</TableCell>}
              <TableCell className="text-xs sm:text-sm py-2 sm:py-4 hidden sm:table-cell">
                {salon.terms_accepted !== false ? (
                  <CheckCircle className="h-4 w-4 sm:h-5 sm:w-5 text-green-500" />
                ) : (
                  <XCircle className="h-4 w-4 sm:h-5 sm:w-5 text-red-500" />
                )}
              </TableCell>
              <TableCell className="text-xs sm:text-sm py-2 sm:py-4 hidden sm:table-cell">
                {salon.privacy_accepted !== false ? (
                  <CheckCircle className="h-4 w-4 sm:h-5 sm:w-5 text-green-500" />
                ) : (
                  <XCircle className="h-4 w-4 sm:h-5 sm:w-5 text-red-500" />
                )}
              </TableCell>
              <TableCell className="text-right py-2 sm:py-4">
                <SalonActions
                  salonId={salon.id}
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
