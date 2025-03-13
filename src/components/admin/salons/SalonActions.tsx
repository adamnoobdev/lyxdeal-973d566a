
import { Button } from "@/components/ui/button";
import { Pencil, Trash2, Package } from "lucide-react";
import { Link } from "react-router-dom";
import { useState } from "react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { MoreHorizontal } from "lucide-react";

interface SalonActionsProps {
  salonId: number;
  onEdit: (e: React.MouseEvent) => void;
  onDelete: (e: React.MouseEvent) => void;
}

export const SalonActions = ({ salonId, onEdit, onDelete }: SalonActionsProps) => {
  const [width, setWidth] = useState(window.innerWidth);

  // Uppdatera bredden när fönstret ändrar storlek
  window.addEventListener('resize', () => setWidth(window.innerWidth));

  // Kompakt mobilversion
  if (width < 640) {
    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="sm">
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={onEdit}>
            <Pencil className="h-4 w-4 mr-2" />
            Redigera
          </DropdownMenuItem>
          <DropdownMenuItem 
            onClick={onDelete}
            className="text-destructive"
          >
            <Trash2 className="h-4 w-4 mr-2" />
            Ta bort
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link to={`/admin/salons/${salonId}/deals`} className="w-full flex items-center">
              <Package className="h-4 w-4 mr-2" />
              Erbjudanden
            </Link>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    );
  }

  // Fullständig version för större skärmar
  return (
    <div className="flex gap-2">
      <Button
        variant="outline"
        size="sm"
        onClick={onEdit}
        className="flex items-center gap-2"
      >
        <Pencil className="h-4 w-4" />
        <span className="hidden sm:inline">Redigera</span>
      </Button>
      <Button
        variant="destructive"
        size="sm"
        onClick={onDelete}
        className="flex items-center gap-2"
      >
        <Trash2 className="h-4 w-4" />
        <span className="hidden sm:inline">Ta bort</span>
      </Button>
      <Button
        variant="outline"
        size="sm"
        asChild
        className="flex items-center gap-2"
      >
        <Link to={`/admin/salons/${salonId}/deals`}>
          <Package className="h-4 w-4" />
          <span className="hidden sm:inline">Erbjudanden</span>
        </Link>
      </Button>
    </div>
  );
};
