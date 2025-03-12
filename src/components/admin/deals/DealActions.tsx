
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal, Pencil, Trash2, Eye, TicketPlus } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { generateDiscountCodes } from "@/utils/discountCodeUtils";

interface DealActionsProps {
  dealId?: number;
  onEdit?: () => void;
  onDelete?: () => void;
  onToggleActive?: () => void;
}

export const DealActions = ({ dealId, onEdit, onDelete, onToggleActive }: DealActionsProps) => {
  const handleGenerateCodes = async () => {
    if (!dealId) return;

    try {
      toast.loading("Skapar rabattkoder...");
      
      // Generate 10 new codes
      const result = await generateDiscountCodes(dealId, 10);
      
      toast.dismiss();
      if (result.success) {
        toast.success(`${result.quantity} nya rabattkoder har skapats`);
      } else {
        toast.error("Kunde inte skapa rabattkoder");
      }
    } catch (error) {
      toast.dismiss();
      console.error('Error generating codes:', error);
      toast.error("Ett fel uppstod när rabattkoder skulle skapas");
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full hover:bg-primary/10">
          <MoreHorizontal className="h-4 w-4 text-primary/80" />
          <span className="sr-only">Öppna meny</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48 border-secondary/20">
        {onEdit && (
          <DropdownMenuItem onClick={onEdit} className="cursor-pointer hover:bg-primary/5">
            <Pencil className="h-4 w-4 mr-2 text-primary" />
            Redigera
          </DropdownMenuItem>
        )}
        <DropdownMenuItem onClick={() => window.open(`/deals/${dealId}`, '_blank')} className="cursor-pointer hover:bg-primary/5">
          <Eye className="h-4 w-4 mr-2 text-primary" />
          Förhandsgranska
        </DropdownMenuItem>
        {dealId && (
          <DropdownMenuItem onClick={handleGenerateCodes} className="cursor-pointer hover:bg-primary/5">
            <TicketPlus className="h-4 w-4 mr-2 text-primary" />
            Skapa 10 rabattkoder
          </DropdownMenuItem>
        )}
        {onDelete && (
          <DropdownMenuItem 
            onClick={onDelete}
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
