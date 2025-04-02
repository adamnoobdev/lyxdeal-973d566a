
import { Button } from "@/components/ui/button";
import { Pencil, Trash2 } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";

interface SalonActionsProps {
  salonId: number;
  onEdit: () => void;
  onDelete: () => void;
}

export const SalonActions = ({ salonId, onEdit, onDelete }: SalonActionsProps) => {
  const isMobile = useIsMobile();
  
  const handleClick = (e: React.MouseEvent, action: () => void) => {
    e.stopPropagation(); // Förhindra att klicket triggar radklicket
    action();
  };

  // For very small screens, render vertical buttons
  if (isMobile) {
    return (
      <div className="flex flex-col gap-1">
        <Button
          variant="outline"
          size="sm"
          onClick={(e) => handleClick(e, onEdit)}
          className="h-7 min-h-0 px-2 py-0.5 text-xs w-full justify-center"
        >
          <Pencil className="h-3 w-3 mr-1" />
          <span>Redigera</span>
        </Button>
        <Button
          variant="destructive"
          size="sm"
          onClick={(e) => handleClick(e, onDelete)}
          className="h-7 min-h-0 px-2 py-0.5 text-xs w-full justify-center"
        >
          <Trash2 className="h-3 w-3 mr-1" />
          <span>Ta bort</span>
        </Button>
      </div>
    );
  }
  
  // For larger screens, render horizontal buttons
  return (
    <div className="flex gap-1 justify-end">
      <Button
        variant="outline"
        size="sm"
        onClick={(e) => handleClick(e, onEdit)}
        className="h-6 xs:h-7 min-h-0 px-1.5 py-0.5 text-[10px] xs:text-xs flex items-center gap-1"
      >
        <Pencil className="h-3 w-3" />
        <span className="hidden xs:inline">Redigera</span>
      </Button>
      <Button
        variant="destructive"
        size="sm"
        onClick={(e) => handleClick(e, onDelete)}
        className="h-6 xs:h-7 min-h-0 px-1.5 py-0.5 text-[10px] xs:text-xs flex items-center gap-1"
      >
        <Trash2 className="h-3 w-3" />
        <span className="hidden xs:inline">Ta bort</span>
      </Button>
    </div>
  );
};
