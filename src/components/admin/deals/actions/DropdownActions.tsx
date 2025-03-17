
import { useState } from "react";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Check, Edit, Eye, MoreHorizontal, Plus, Tag, Trash, X } from "lucide-react";
import { BaseActionProps, DiscountCodeActionProps, ToggleActiveActionProps } from "./types";

type DropdownActionsProps = BaseActionProps & ToggleActiveActionProps & DiscountCodeActionProps & {
  onEdit?: () => void;
  onDelete?: () => void;
  onPreview?: () => void;
  isActive?: boolean;
};

export const DropdownActions = ({
  onEdit,
  onDelete,
  onPreview,
  onToggleActive,
  isActive,
  onViewDiscountCodes,
  onGenerateDiscountCodes,
  isGeneratingCodes,
}: DropdownActionsProps) => {
  const [isTogglingActive, setIsTogglingActive] = useState(false);

  const handleToggleActive = async () => {
    if (!onToggleActive || isTogglingActive) return;
    
    setIsTogglingActive(true);
    try {
      await onToggleActive();
    } finally {
      setIsTogglingActive(false);
    }
  };

  const handleGenerateDiscountCodes = async () => {
    if (!onGenerateDiscountCodes || isGeneratingCodes) return;
    await onGenerateDiscountCodes();
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="h-8 w-8 p-0">
          <span className="sr-only">Öppna meny</span>
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="min-w-[160px]">
        <DropdownMenuLabel>Åtgärder</DropdownMenuLabel>
        
        {onPreview && (
          <DropdownMenuItem onClick={onPreview}>
            <Eye className="mr-2 h-4 w-4" />
            Förhandsgranska
          </DropdownMenuItem>
        )}
        
        {onEdit && (
          <DropdownMenuItem onClick={onEdit}>
            <Edit className="mr-2 h-4 w-4" />
            Redigera
          </DropdownMenuItem>
        )}
        
        {onDelete && (
          <DropdownMenuItem onClick={onDelete} className="text-red-600">
            <Trash className="mr-2 h-4 w-4" />
            Ta bort
          </DropdownMenuItem>
        )}
        
        {onToggleActive && (
          <DropdownMenuItem onClick={handleToggleActive} disabled={isTogglingActive}>
            {isActive ? (
              <>
                <X className="mr-2 h-4 w-4" />
                Inaktivera
              </>
            ) : (
              <>
                <Check className="mr-2 h-4 w-4" />
                Aktivera
              </>
            )}
          </DropdownMenuItem>
        )}

        {(onViewDiscountCodes || onGenerateDiscountCodes) && <DropdownMenuSeparator />}
        
        {onViewDiscountCodes && (
          <DropdownMenuItem onClick={onViewDiscountCodes}>
            <Tag className="mr-2 h-4 w-4" />
            Visa rabattkoder
          </DropdownMenuItem>
        )}
        
        {onGenerateDiscountCodes && (
          <DropdownMenuItem 
            onClick={handleGenerateDiscountCodes}
            disabled={isGeneratingCodes}
          >
            <Plus className="mr-2 h-4 w-4" />
            Generera nya koder
          </DropdownMenuItem>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
