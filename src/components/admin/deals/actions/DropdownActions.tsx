
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Eye, MoreHorizontal, Pencil, Power, Ticket, TicketCheck, Trash2 } from "lucide-react";
import { useState } from "react";
import { DiscountCodeActionProps, ToggleActiveActionProps } from "./types";

interface DropdownActionsProps extends ToggleActiveActionProps, DiscountCodeActionProps {
  onDelete?: () => void;
}

export function DropdownActions({
  onEdit,
  onDelete,
  onToggleActive,
  isActive,
  onPreview,
  onViewDiscountCodes,
  onGenerateDiscountCodes,
  isGeneratingCodes,
  actionButtonsConfig = {
    edit: true,
    delete: true,
    preview: true,
    viewCodes: true
  }
}: DropdownActionsProps) {
  const [open, setOpen] = useState(false);

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className="h-8 w-8 p-0 data-[state=open]:bg-muted"
        >
          <span className="sr-only">Öppna meny</span>
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-[160px]">
        {onPreview && actionButtonsConfig.preview && (
          <DropdownMenuItem
            onClick={() => {
              onPreview();
              setOpen(false);
            }}
          >
            <Eye className="mr-2 h-4 w-4" />
            <span>Förhandsgranska</span>
          </DropdownMenuItem>
        )}
        {onEdit && actionButtonsConfig.edit && (
          <DropdownMenuItem
            onClick={() => {
              onEdit();
              setOpen(false);
            }}
          >
            <Pencil className="mr-2 h-4 w-4" />
            <span>Redigera</span>
          </DropdownMenuItem>
        )}
        {onViewDiscountCodes && actionButtonsConfig.viewCodes && (
          <DropdownMenuItem
            onClick={() => {
              onViewDiscountCodes();
              setOpen(false);
            }}
          >
            <Ticket className="mr-2 h-4 w-4" />
            <span>Visa rabattkoder</span>
          </DropdownMenuItem>
        )}
        {onGenerateDiscountCodes && (
          <DropdownMenuItem
            onClick={() => {
              onGenerateDiscountCodes();
              setOpen(false);
            }}
            disabled={isGeneratingCodes}
          >
            <TicketCheck className="mr-2 h-4 w-4" />
            <span>Skapa rabattkoder</span>
          </DropdownMenuItem>
        )}
        {onToggleActive && (
          <>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={() => {
                onToggleActive();
                setOpen(false);
              }}
            >
              <Power className="mr-2 h-4 w-4" />
              <span>{isActive ? "Inaktivera" : "Aktivera"}</span>
            </DropdownMenuItem>
          </>
        )}
        {onDelete && actionButtonsConfig.delete && (
          <>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={() => {
                onDelete();
                setOpen(false);
              }}
              className="text-destructive focus:text-destructive"
            >
              <Trash2 className="mr-2 h-4 w-4" />
              <span>Ta bort</span>
            </DropdownMenuItem>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
