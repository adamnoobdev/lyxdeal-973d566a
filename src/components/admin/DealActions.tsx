import { Button } from "@/components/ui/button";
import { Pencil, Trash2 } from "lucide-react";

interface DealActionsProps {
  onEdit: () => void;
  onDelete: () => void;
}

export const DealActions = ({ onEdit, onDelete }: DealActionsProps) => {
  return (
    <div className="flex gap-2 flex-wrap">
      <Button
        variant="outline"
        size="sm"
        onClick={onEdit}
        className="flex items-center gap-2 whitespace-nowrap"
      >
        <Pencil className="h-4 w-4" />
        <span className="hidden sm:inline">Redigera</span>
      </Button>
      <Button
        variant="destructive"
        size="sm"
        onClick={onDelete}
        className="flex items-center gap-2 whitespace-nowrap"
      >
        <Trash2 className="h-4 w-4" />
        <span className="hidden sm:inline">Ta bort</span>
      </Button>
    </div>
  );
};