
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
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="h-8 w-8 p-0">
          <MoreHorizontal className="h-4 w-4" />
          <span className="sr-only">Öppna meny</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {onPreview && (
          <DropdownMenuItem onClick={onPreview}>
            <Eye className="mr-2 h-4 w-4" />
            <span>Förhandsgranska</span>
          </DropdownMenuItem>
        )}
        {onViewDiscountCodes && (
          <DropdownMenuItem onClick={onViewDiscountCodes}>
            <Tags className="mr-2 h-4 w-4" />
            <span>Visa rabattkoder</span>
          </DropdownMenuItem>
        )}
        {onApprove && (
          <DropdownMenuItem onClick={onApprove}>
            <Check className="mr-2 h-4 w-4" />
            <span>Godkänn</span>
          </DropdownMenuItem>
        )}
        {onReject && (
          <DropdownMenuItem onClick={onReject}>
            <XCircle className="mr-2 h-4 w-4" />
            <span>Neka</span>
          </DropdownMenuItem>
        )}
        {(onEdit || onDelete || onToggleActive) && <DropdownMenuSeparator />}
        {onEdit && (
          <DropdownMenuItem onClick={onEdit}>
            <Edit className="mr-2 h-4 w-4" />
            <span>Redigera</span>
          </DropdownMenuItem>
        )}
        {onToggleActive && (
          <DropdownMenuItem onClick={onToggleActive}>
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
            onClick={onDelete}
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
