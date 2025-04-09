
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { ChevronDown } from "lucide-react";
import { BaseActionProps } from "./types";

interface SalonViewActionProps extends BaseActionProps {
  onViewDiscountCodes?: () => void;
  onDelete?: () => void;
}

export const SalonViewActions = ({
  onEdit,
  onPreview,
  onViewDiscountCodes,
  onDelete
}: SalonViewActionProps) => {
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
        
        {onViewDiscountCodes && (
          <DropdownMenuItem 
            onClick={onViewDiscountCodes} 
            className="text-sm text-teal-600 font-medium hover:bg-teal-50"
          >
            Visa rabattkoder
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
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
