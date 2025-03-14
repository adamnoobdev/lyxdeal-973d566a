
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Check,
  Edit,
  Eye,
  MoreHorizontal,
  Tags,
  Trash,
  XCircle,
} from "lucide-react";
import { useState } from "react";

interface DealActionsProps {
  onDelete?: () => void;
  onEdit?: () => void;
  onToggleActive?: () => void;
  onPreview?: () => void;
  onApprove?: () => void;
  onReject?: () => void;
  isActive?: boolean;
  onViewDiscountCodes?: () => void;
}

export const DealActions = ({
  onDelete,
  onEdit,
  onToggleActive,
  onPreview,
  onApprove,
  onReject,
  isActive,
  onViewDiscountCodes,
}: DealActionsProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [lastActionTime, setLastActionTime] = useState(0);

  const handleAction = (action: () => void) => () => {
    // Prevent double-clicks or multiple rapid actions
    const now = Date.now();
    if (now - lastActionTime < 500) {
      return;
    }
    
    setLastActionTime(now);
    setIsOpen(false);
    
    // Use setTimeout to ensure dropdown closes before action executes
    setTimeout(() => {
      action();
    }, 50);
  };

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="h-8 w-8 p-0">
          <MoreHorizontal className="h-4 w-4" />
          <span className="sr-only">Öppna meny</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {onPreview && (
          <DropdownMenuItem onClick={handleAction(onPreview)}>
            <Eye className="mr-2 h-4 w-4" />
            <span>Förhandsgranska</span>
          </DropdownMenuItem>
        )}
        {onViewDiscountCodes && (
          <DropdownMenuItem onClick={handleAction(onViewDiscountCodes)}>
            <Tags className="mr-2 h-4 w-4" />
            <span>Visa rabattkoder</span>
          </DropdownMenuItem>
        )}
        {onApprove && (
          <DropdownMenuItem onClick={handleAction(onApprove)}>
            <Check className="mr-2 h-4 w-4" />
            <span>Godkänn</span>
          </DropdownMenuItem>
        )}
        {onReject && (
          <DropdownMenuItem onClick={handleAction(onReject)}>
            <XCircle className="mr-2 h-4 w-4" />
            <span>Neka</span>
          </DropdownMenuItem>
        )}
        {(onEdit || onDelete || onToggleActive) && <DropdownMenuSeparator />}
        {onEdit && (
          <DropdownMenuItem onClick={handleAction(onEdit)}>
            <Edit className="mr-2 h-4 w-4" />
            <span>Redigera</span>
          </DropdownMenuItem>
        )}
        {onToggleActive && (
          <DropdownMenuItem onClick={handleAction(onToggleActive)}>
            {isActive ? (
              <>
                <XCircle className="mr-2 h-4 w-4" />
                <span>Inaktivera</span>
              </>
            ) : (
              <>
                <Check className="mr-2 h-4 w-4" />
                <span>Aktivera</span>
              </>
            )}
          </DropdownMenuItem>
        )}
        {onDelete && (
          <DropdownMenuItem
            onClick={handleAction(onDelete)}
            className="text-destructive focus:bg-destructive/10"
          >
            <Trash className="mr-2 h-4 w-4" />
            <span>Ta bort</span>
          </DropdownMenuItem>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
