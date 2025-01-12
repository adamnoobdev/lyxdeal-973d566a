import { Button } from "@/components/ui/button";
import { Pencil, Trash2, Package } from "lucide-react";
import { Link } from "react-router-dom";

interface SalonActionsProps {
  salonId: number;
  onEdit: () => void;
  onDelete: () => void;
}

export const SalonActions = ({ salonId, onEdit, onDelete }: SalonActionsProps) => {
  return (
    <div className="flex gap-2">
      <Button
        variant="outline"
        size="sm"
        onClick={onEdit}
        className="flex items-center gap-2"
      >
        <Pencil className="h-4 w-4" />
        Redigera
      </Button>
      <Button
        variant="destructive"
        size="sm"
        onClick={onDelete}
        className="flex items-center gap-2"
      >
        <Trash2 className="h-4 w-4" />
        Ta bort
      </Button>
      <Button
        variant="outline"
        size="sm"
        asChild
        className="flex items-center gap-2"
      >
        <Link to={`/admin/salons/${salonId}/deals`}>
          <Package className="h-4 w-4" />
          Erbjudanden
        </Link>
      </Button>
    </div>
  );
};