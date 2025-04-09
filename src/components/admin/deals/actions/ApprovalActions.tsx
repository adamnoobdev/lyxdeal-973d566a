
import { useState } from "react";
import { ApprovalActionProps } from "./types";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { ChevronDown } from "lucide-react";

export const ApprovalActions = ({ 
  onEdit, 
  onPreview, 
  onApprove, 
  onReject,
  onDelete
}: ApprovalActionProps) => {
  const [isApproving, setIsApproving] = useState(false);
  const [isRejecting, setIsRejecting] = useState(false);

  const handleApprove = async () => {
    if (!onApprove || isApproving) return;
    
    setIsApproving(true);
    try {
      await onApprove();
    } finally {
      setIsApproving(false);
    }
  };

  const handleReject = async () => {
    if (!onReject || isRejecting) return;
    
    setIsRejecting(true);
    try {
      await onReject();
    } finally {
      setIsRejecting(false);
    }
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

        {onApprove && (
          <DropdownMenuItem 
            onClick={handleApprove} 
            disabled={isApproving} 
            className="text-sm text-success-500 font-medium hover:bg-success-50"
          >
            {isApproving ? "Godkänner..." : "Godkänn"}
          </DropdownMenuItem>
        )}

        {onReject && (
          <DropdownMenuItem 
            onClick={handleReject} 
            disabled={isRejecting} 
            className="text-sm text-destructive font-medium hover:bg-destructive-50"
          >
            {isRejecting ? "Nekar..." : "Neka"}
          </DropdownMenuItem>
        )}
        
        {onDelete && (
          <DropdownMenuItem 
            onClick={onDelete}
            className="text-sm text-destructive font-medium hover:bg-destructive-50"
          >
            Ta bort
          </DropdownMenuItem>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
