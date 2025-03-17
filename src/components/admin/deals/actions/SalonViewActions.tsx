
import { Download, Edit, Eye, Tag } from "lucide-react";
import { DiscountCodeActionProps } from "./types";
import { ActionButton } from "./ActionButton";

export const SalonViewActions = ({ 
  onEdit, 
  onPreview, 
  onViewDiscountCodes,
  isGeneratingCodes
}: DiscountCodeActionProps) => {
  return (
    <div className="flex flex-wrap items-center gap-1 sm:gap-2">
      <ActionButton
        onClick={onPreview}
        title="Förhandsgranska erbjudande"
        className="h-8 w-8"
      >
        <Eye className="h-4 w-4" />
      </ActionButton>

      <ActionButton
        onClick={onEdit}
        title="Redigera erbjudande"
        className="h-8 w-8"
      >
        <Edit className="h-4 w-4" />
      </ActionButton>

      <ActionButton
        onClick={onViewDiscountCodes}
        title="Visa rabattkoder"
        className="h-8 w-8"
        loading={isGeneratingCodes}
      >
        <Tag className="h-4 w-4" />
      </ActionButton>
    </div>
  );
};
