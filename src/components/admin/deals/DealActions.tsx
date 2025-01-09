import { Button } from "@/components/ui/button";
import { Edit, Trash } from "lucide-react";

interface DealActionsProps {
  onEdit: () => void;
  onDelete: () => void;
}

export const DealActions = ({ onEdit, onDelete }: DealActionsProps) => {
  return (
    <div className="flex gap-2">
      <Button variant="outline" size="icon" onClick={onEdit}>
        <Edit className="h-4 w-4" />
      </Button>
      <Button variant="outline" size="icon" onClick={onDelete}>
        <Trash className="h-4 w-4" />
      </Button>
    </div>
  );
};