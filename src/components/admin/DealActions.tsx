
import { Button } from "@/components/ui/button";
import { Pencil, Trash2 } from "lucide-react";

interface DealActionsProps {
  onEdit: () => void;
  onDelete: () => void;
}

export const DealActions = ({ onEdit, onDelete }: DealActionsProps) => {
  return (
    <div className="flex gap-1 sm:gap-2 flex-wrap">
      <Button
        variant="outline"
        size="sm"
        onClick={onEdit}
        className="flex items-center gap-1 sm:gap-2 whitespace-nowrap text-xs sm:text-sm px-2 py-1"
      >
        <Pencil className="h-3 w-3 sm:h-4 sm:w-4" />
        <span className="hidden sm:inline">Redigera</span>
      </Button>
      <Button
        variant="destructive"
        size="sm"
        onClick={onDelete}
        className="flex items-center gap-1 sm:gap-2 whitespace-nowrap text-xs sm:text-sm px-2 py-1"
      >
        <Trash2 className="h-3 w-3 sm:h-4 sm:w-4" />
        <span className="hidden sm:inline">Ta bort</span>
      </Button>
    </div>
  );
};
