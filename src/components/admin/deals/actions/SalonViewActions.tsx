
import React from 'react';
import { Button } from "@/components/ui/button";
import { Eye, FileEdit, Ticket, Trash2 } from "lucide-react";
import { BaseActionProps } from './types';

interface SalonViewActionsProps extends BaseActionProps {
  onEdit?: () => void;
  onPreview?: () => void;
  onViewDiscountCodes?: () => void;
  onDelete?: () => void;
  actionButtonsConfig?: {
    edit?: boolean;
    delete?: boolean;
    preview?: boolean;
    viewCodes?: boolean;
  };
}

export function SalonViewActions({ 
  onEdit, 
  onPreview, 
  onViewDiscountCodes, 
  onDelete,
  actionButtonsConfig = {
    edit: true,
    delete: true,
    preview: false,
    viewCodes: true
  }
}: SalonViewActionsProps) {
  return (
    <div className="flex flex-wrap gap-1 justify-end">
      {actionButtonsConfig.edit && onEdit && (
        <Button
          variant="outline"
          size="sm"
          onClick={onEdit}
          className="flex items-center gap-1 whitespace-nowrap text-[10px] xs:text-xs px-1.5 py-0.5 h-6 xs:h-7 min-h-0 min-w-0"
        >
          <FileEdit className="h-3 w-3" />
          <span className="hidden xs:inline">Redigera</span>
        </Button>
      )}
      
      {actionButtonsConfig.preview && onPreview && (
        <Button
          variant="outline"
          size="sm"
          onClick={onPreview}
          className="flex items-center gap-1 whitespace-nowrap text-[10px] xs:text-xs px-1.5 py-0.5 h-6 xs:h-7 min-h-0 min-w-0"
        >
          <Eye className="h-3 w-3" />
          <span className="hidden xs:inline">Förhandsgranska</span>
        </Button>
      )}
      
      {actionButtonsConfig.viewCodes && onViewDiscountCodes && (
        <Button
          variant="outline" 
          size="sm"
          onClick={onViewDiscountCodes}
          className="flex items-center gap-1 whitespace-nowrap text-[10px] xs:text-xs px-1.5 py-0.5 h-6 xs:h-7 min-h-0 min-w-0 border-primary/60 text-primary hover:bg-primary/5"
        >
          <Ticket className="h-3 w-3" />
          <span className="hidden xs:inline">Rabattkoder</span>
        </Button>
      )}
      
      {actionButtonsConfig.delete && onDelete && (
        <Button
          variant="destructive"
          size="sm"
          onClick={onDelete}
          className="flex items-center gap-1 whitespace-nowrap text-[10px] xs:text-xs px-1.5 py-0.5 h-6 xs:h-7 min-h-0 min-w-0"
        >
          <Trash2 className="h-3 w-3" />
          <span className="hidden xs:inline">Ta bort</span>
        </Button>
      )}
    </div>
  );
}
