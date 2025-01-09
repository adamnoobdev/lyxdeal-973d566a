import { Button } from "@/components/ui/button";
import { Edit, Trash } from "lucide-react";

interface SalonActionsProps {
  onEdit: () => void;
  onDelete: () => void;
}

export const SalonActions = ({ onEdit, onDelete }: SalonActionsProps) => {
  return (
    <div className="flex gap-2">
      <Button variant="ghost" size="icon" onClick={onEdit}>
        <Edit className="h-4 w-4" />
      </Button>
      <Button variant="ghost" size="icon" onClick={onDelete}>
        <Trash className="h-4 w-4" />
      </Button>
    </div>
  );
};