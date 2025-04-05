
import { useState } from "react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { MoreVertical, Pencil, Trash2, Star } from "lucide-react";
import { Salon } from "@/components/admin/types";

interface SalonActionsProps {
  salon: Salon;
  onEdit: (salon: Salon) => void;
  onDelete: (salon: Salon) => void;
  onRate?: (salon: Salon) => void;
}

export const SalonActions = ({ salon, onEdit, onDelete, onRate }: SalonActionsProps) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon">
          <MoreVertical className="h-4 w-4" />
          <span className="sr-only">Öppna meny</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-[160px]">
        <DropdownMenuItem
          onClick={() => {
            setIsOpen(false);
            onEdit(salon);
          }}
        >
          <Pencil className="h-4 w-4 mr-2" />
          Redigera
        </DropdownMenuItem>
        
        {onRate && (
          <DropdownMenuItem
            onClick={() => {
              setIsOpen(false);
              onRate(salon);
            }}
          >
            <Star className="h-4 w-4 mr-2" />
            Betygsätt
          </DropdownMenuItem>
        )}
        
        <DropdownMenuSeparator />
        
        <DropdownMenuItem
          onClick={() => {
            setIsOpen(false);
            onDelete(salon);
          }}
          className="text-destructive focus:text-destructive"
        >
          <Trash2 className="h-4 w-4 mr-2" />
          Ta bort
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
