
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal, Pencil, Trash2, Eye } from "lucide-react";
import { useState, useRef } from "react";

interface DealActionsProps {
  onEdit?: () => void;
  onDelete?: () => void;
  onToggleActive?: () => void;
}

export const DealActions = ({ onEdit, onDelete, onToggleActive }: DealActionsProps) => {
  const [open, setOpen] = useState(false);
  const actionInProgressRef = useRef(false);
  
  const handleAction = (action: (() => void) | undefined) => {
    if (!action || actionInProgressRef.current) return;
    
    actionInProgressRef.current = true;
    setOpen(false);
    
    // Short delay to ensure dropdown closes first
    setTimeout(() => {
      action();
      actionInProgressRef.current = false;
    }, 100);
  };

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full hover:bg-primary/10">
          <MoreHorizontal className="h-4 w-4 text-primary/80" />
          <span className="sr-only">Öppna meny</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-40 border-secondary/20">
        {onEdit && (
          <DropdownMenuItem 
            onClick={() => handleAction(onEdit)} 
            className="cursor-pointer hover:bg-primary/5"
          >
            <Pencil className="h-4 w-4 mr-2 text-primary" />
            Redigera
          </DropdownMenuItem>
        )}
        <DropdownMenuItem 
          onClick={() => window.open(`/deals/1`, '_blank')} 
          className="cursor-pointer hover:bg-primary/5"
        >
          <Eye className="h-4 w-4 mr-2 text-primary" />
          Förhandsgranska
        </DropdownMenuItem>
        {onDelete && (
          <DropdownMenuItem 
            onClick={() => handleAction(onDelete)}
            className="text-destructive focus:text-destructive cursor-pointer"
          >
            <Trash2 className="h-4 w-4 mr-2" />
            Ta bort
          </DropdownMenuItem>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
