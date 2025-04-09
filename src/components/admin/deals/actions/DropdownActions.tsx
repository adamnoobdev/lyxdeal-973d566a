
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
import { ChevronDown } from "lucide-react";
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
        <Button 
          variant="outline" 
          className="bg-white border-gray-300 hover:bg-gray-50 focus:ring-primary text-sm"
        >
          Åtgärder <ChevronDown className="ml-1 h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="bg-white shadow-md border-gray-200 min-w-[180px] z-[9999]">
        <DropdownMenuLabel className="font-medium text-gray-700">Alternativ</DropdownMenuLabel>
        
        {onPreview && (
          <DropdownMenuItem onClick={onPreview} className="text-sm hover:bg-gray-100">
            Förhandsgranska
          </DropdownMenuItem>
        )}
        
        {onEdit && (
          <DropdownMenuItem onClick={onEdit} className="text-sm hover:bg-gray-100">
            Redigera
          </DropdownMenuItem>
        )}
        
        {onDelete && (
          <DropdownMenuItem 
            onClick={onDelete} 
            className="text-sm text-red-600 font-medium hover:bg-red-50"
          >
            Ta bort
          </DropdownMenuItem>
        )}
        
        {onToggleActive && (
          <DropdownMenuItem 
            onClick={handleToggleActive} 
            disabled={isTogglingActive} 
            className={isActive ? 
              "text-sm text-red-600 font-medium hover:bg-red-50" : 
              "text-sm text-green-600 font-medium hover:bg-green-50"
            }
          >
            {isActive ? "Inaktivera" : "Aktivera"}
          </DropdownMenuItem>
        )}

        {(onViewDiscountCodes || onGenerateDiscountCodes) && <DropdownMenuSeparator />}
        
        {onViewDiscountCodes && (
          <DropdownMenuItem 
            onClick={onViewDiscountCodes}
            className="text-sm text-teal-600 font-medium hover:bg-teal-50"
          >
            Visa rabattkoder
          </DropdownMenuItem>
        )}
        
        {onGenerateDiscountCodes && (
          <DropdownMenuItem 
            onClick={handleGenerateDiscountCodes}
            disabled={isGeneratingCodes}
            className="text-sm text-primary font-medium hover:bg-primary-50"
          >
            {isGeneratingCodes ? "Genererar..." : "Generera nya koder"}
          </DropdownMenuItem>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
