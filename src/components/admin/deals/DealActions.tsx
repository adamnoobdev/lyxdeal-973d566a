
import { ApprovalActions, DropdownActions, SalonViewActions } from './actions';

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
  actionButtonsConfig?: {
    edit?: boolean;
    delete?: boolean;
    preview?: boolean;
    viewCodes?: boolean;
  };
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
  showViewCodesForSalon = false,
  actionButtonsConfig
}: DealActionsProps) => {
  
  // For approval/rejection actions
  if (onApprove && onReject) {
    return (
      <ApprovalActions 
        onEdit={onEdit}
        onPreview={onPreview}
        onApprove={onApprove}
        onReject={onReject}
        onDelete={onDelete}
      />
    );
  }

  // Check if this is a salon view and should show the view codes option directly
  if (showViewCodesForSalon && onViewDiscountCodes) {
    return (
      <SalonViewActions
        onEdit={onEdit}
        onPreview={onPreview}
        onViewDiscountCodes={onViewDiscountCodes}
        onDelete={onDelete}
        actionButtonsConfig={actionButtonsConfig}
      />
    );
  }

  // Default dropdown menu for most cases
  return (
    <DropdownActions
      onEdit={onEdit}
      onDelete={onDelete}
      onToggleActive={onToggleActive}
      isActive={isActive}
      onPreview={onPreview}
      onViewDiscountCodes={onViewDiscountCodes}
      onGenerateDiscountCodes={onGenerateDiscountCodes}
      isGeneratingCodes={isGeneratingCodes}
      actionButtonsConfig={actionButtonsConfig}
    />
  );
};
