
import { Edit, Eye, Tag } from "lucide-react";
import { DiscountCodeActionProps } from "./types";
import { ActionButton } from "./ActionButton";

export const SalonViewActions = ({ 
  onEdit, 
  onPreview, 
  onViewDiscountCodes 
}: DiscountCodeActionProps) => {
  return (
    <div className="flex items-center gap-1">
      <ActionButton
        onClick={onPreview}
        title="Förhandsgranska erbjudande"
      >
        <Eye className="h-4 w-4" />
      </ActionButton>

      <ActionButton
        onClick={onEdit}
        title="Redigera erbjudande"
      >
        <Edit className="h-4 w-4" />
      </ActionButton>

      <ActionButton
        onClick={onViewDiscountCodes}
        title="Visa rabattkoder"
      >
        <Tag className="h-4 w-4" />
      </ActionButton>
    </div>
  );
};
