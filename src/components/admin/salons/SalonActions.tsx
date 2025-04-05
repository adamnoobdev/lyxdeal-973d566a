
import { Button } from "@/components/ui/button";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal, Pencil, Trash, Star } from "lucide-react";
import { Salon } from "../types";

interface SalonActionsProps {
  salon: Salon;
  onEdit: (salon: Salon) => void;
  onDelete: (salon: Salon) => void;
  onRate?: (salon: Salon) => void;
}

export const SalonActions = ({ 
  salon, 
  onEdit, 
  onDelete,
  onRate
}: SalonActionsProps) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="h-8 w-8 p-0">
          <span className="sr-only">Öppna meny</span>
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => onEdit(salon)}>
          <Pencil className="mr-2 h-4 w-4" />
          <span>Redigera</span>
        </DropdownMenuItem>
        {onRate && (
          <DropdownMenuItem onClick={() => onRate(salon)}>
            <Star className="mr-2 h-4 w-4" />
            <span>Betygsätt</span>
          </DropdownMenuItem>
        )}
        <DropdownMenuItem 
          onClick={() => onDelete(salon)}
          className="text-red-600 hover:text-red-700 focus:text-red-700"
        >
          <Trash className="mr-2 h-4 w-4" />
          <span>Ta bort</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
