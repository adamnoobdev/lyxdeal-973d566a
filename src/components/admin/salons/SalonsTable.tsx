
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
import { useIsMobile } from "@/hooks/use-mobile";

export interface SalonsTableProps {
  salons: Salon[];
  onEdit: (salon: Salon) => void;
  onDelete: (salon: Salon) => void;
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

  const isMobile = useIsMobile();
  
  return (
    <div className="border rounded-md overflow-x-auto max-w-full">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-12 font-medium text-xs sm:text-sm">ID</TableHead>
            <TableHead className="font-medium text-xs sm:text-sm">Namn</TableHead>
            {!isMobile && <TableHead className="font-medium text-xs sm:text-sm hidden sm:table-cell">Email</TableHead>}
            {!isMobile && <TableHead className="font-medium text-xs sm:text-sm hidden md:table-cell">Roll</TableHead>}
            {!isMobile && <TableHead className="font-medium text-xs sm:text-sm hidden lg:table-cell">Skapad</TableHead>}
            <TableHead className="font-medium text-xs sm:text-sm hidden sm:table-cell w-14">Villkor</TableHead>
            <TableHead className="font-medium text-xs sm:text-sm hidden sm:table-cell w-14">Integritet</TableHead>
            <TableHead className="font-medium text-xs sm:text-sm text-right">Hantera</TableHead>
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
              <TableCell className="text-xs sm:text-sm py-2 sm:py-4">
                <div className="truncate max-w-[100px] xs:max-w-[120px] sm:max-w-[150px] md:max-w-full">
                  {salon.name}
                  {isMobile && (
                    <div className="text-muted-foreground text-[10px] truncate mt-0.5">
                      {salon.email}
                    </div>
                  )}
                </div>
              </TableCell>
              {!isMobile && <TableCell className="text-xs sm:text-sm py-2 sm:py-4 hidden sm:table-cell">{salon.email}</TableCell>}
              {!isMobile && <TableCell className="text-xs sm:text-sm py-2 sm:py-4 hidden md:table-cell">{salon.role === 'admin' ? 'Admin' : 'Salongägare'}</TableCell>}
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
              <TableCell className="text-right py-2 px-2 sm:px-4 sm:py-4 w-20 xs:w-24 sm:w-auto">
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
