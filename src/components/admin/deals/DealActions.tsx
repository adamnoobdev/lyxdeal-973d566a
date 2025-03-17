
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Edit, MoreHorizontal, Trash, Check, X, Eye, Plus, Tag } from "lucide-react";
import { useState } from "react";
import { LoadingButton } from "@/components/ui/loading-button";

interface DealActionsProps {
  onEdit?: () => void;
  onDelete?: () => void;
  onToggleActive?: () => Promise<boolean | void>;
  isActive?: boolean;
  onPreview?: () => void;
  onApprove?: () => Promise<void>;
  onReject?: () => Promise<void>;
  onViewDiscountCodes?: () => void;
  onGenerateDiscountCodes?: () => Promise<void>;
  isGeneratingCodes?: boolean;
  showViewCodesForSalon?: boolean;
}

export const DealActions = ({
  onEdit,
  onDelete,
  onToggleActive,
  isActive,
  onPreview,
  onApprove,
  onReject,
  onViewDiscountCodes,
  onGenerateDiscountCodes,
  isGeneratingCodes,
  showViewCodesForSalon = false
}: DealActionsProps) => {
  const [isTogglingActive, setIsTogglingActive] = useState(false);
  const [isApproving, setIsApproving] = useState(false);
  const [isRejecting, setIsRejecting] = useState(false);

  const handleToggleActive = async () => {
    if (!onToggleActive || isTogglingActive) return;
    
    setIsTogglingActive(true);
    try {
      await onToggleActive();
    } finally {
      setIsTogglingActive(false);
    }
  };

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

  const handleGenerateDiscountCodes = async () => {
    if (!onGenerateDiscountCodes || isGeneratingCodes) return;
    await onGenerateDiscountCodes();
  };

  // For approval/rejection actions
  if (onApprove && onReject) {
    return (
      <div className="flex items-center gap-1">
        <Button
          variant="outline"
          size="icon"
          onClick={onPreview}
          className="h-8 w-8"
          title="Förhandsgranska erbjudande"
        >
          <Eye className="h-4 w-4" />
        </Button>
        <Button
          variant="outline"
          size="icon"
          onClick={onEdit}
          className="h-8 w-8"
          title="Redigera erbjudande"
        >
          <Edit className="h-4 w-4" />
        </Button>
        <LoadingButton
          variant="default"
          size="icon"
          onClick={handleApprove}
          loading={isApproving}
          className="h-8 w-8 bg-green-600 hover:bg-green-700"
          title="Godkänn erbjudande"
        >
          <Check className="h-4 w-4" />
        </LoadingButton>
        <LoadingButton
          variant="outline"
          size="icon"
          onClick={handleReject}
          loading={isRejecting}
          className="h-8 w-8 text-red-500 hover:bg-red-50 hover:text-red-600 border-red-200"
          title="Neka erbjudande"
        >
          <X className="h-4 w-4" />
        </LoadingButton>
      </div>
    );
  }

  // Check if this is a salon view and should show the view codes option directly
  if (showViewCodesForSalon && onViewDiscountCodes) {
    return (
      <div className="flex items-center gap-1">
        <Button
          variant="outline"
          size="icon"
          onClick={onPreview}
          className="h-8 w-8"
          title="Förhandsgranska erbjudande"
        >
          <Eye className="h-4 w-4" />
        </Button>
        <Button
          variant="outline"
          size="icon"
          onClick={onEdit}
          className="h-8 w-8"
          title="Redigera erbjudande"
        >
          <Edit className="h-4 w-4" />
        </Button>
        <Button
          variant="outline"
          size="icon"
          onClick={onViewDiscountCodes}
          className="h-8 w-8"
          title="Visa rabattkoder"
        >
          <Tag className="h-4 w-4" />
        </Button>
      </div>
    );
  }

  // Default dropdown menu for most cases
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
