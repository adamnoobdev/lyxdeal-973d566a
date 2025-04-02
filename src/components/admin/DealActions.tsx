
import { Button } from "@/components/ui/button";
import { Pencil, Trash2 } from "lucide-react";

interface DealActionsProps {
  onEdit: () => void;
  onDelete: () => void;
}

export const DealActions = ({ onEdit, onDelete }: DealActionsProps) => {
  return (
    <div className="flex gap-1 flex-wrap">
      <Button
        variant="outline"
        size="sm"
        onClick={onEdit}
        className="flex items-center gap-1 whitespace-nowrap text-[10px] xs:text-xs px-1.5 py-0.5 h-7 min-h-0 min-w-0"
      >
        <Pencil className="h-3 w-3" />
        <span className="hidden xs:inline">Redigera</span>
      </Button>
      <Button
        variant="destructive"
        size="sm"
        onClick={onDelete}
        className="flex items-center gap-1 whitespace-nowrap text-[10px] xs:text-xs px-1.5 py-0.5 h-7 min-h-0 min-w-0"
      >
        <Trash2 className="h-3 w-3" />
        <span className="hidden xs:inline">Ta bort</span>
      </Button>
    </div>
  );
};
