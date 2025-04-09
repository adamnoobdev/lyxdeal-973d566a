
import { Edit, Eye, Tag, Trash2 } from "lucide-react";
import { ActionButton } from "./ActionButton";
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
    <div className="flex items-center gap-1">
      {onPreview && (
        <ActionButton
          onClick={onPreview}
          title="Förhandsgranska erbjudande"
        >
          <Eye className="h-4 w-4" />
        </ActionButton>
      )}
      
      {onEdit && (
        <ActionButton
          onClick={onEdit}
          title="Redigera erbjudande"
        >
          <Edit className="h-4 w-4" />
        </ActionButton>
      )}
      
      {onViewDiscountCodes && (
        <ActionButton
          onClick={onViewDiscountCodes}
          title="Visa rabattkoder"
          className="h-8 w-8 text-teal-600 hover:bg-teal-50"
        >
          <Tag className="h-4 w-4" />
        </ActionButton>
      )}

      {onDelete && (
        <ActionButton
          onClick={onDelete}
          title="Ta bort erbjudande"
          className="h-8 w-8 text-red-600 hover:bg-red-50"
        >
          <Trash2 className="h-4 w-4" />
        </ActionButton>
      )}
    </div>
  );
};
