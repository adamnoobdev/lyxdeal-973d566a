
export interface BaseActionProps {
  onClick?: () => void;
  disabled?: boolean;
  title?: string;
  onEdit?: () => void;
  onPreview?: () => void;
  actionButtonsConfig?: {
    edit?: boolean;
    delete?: boolean;
    preview?: boolean;
    viewCodes?: boolean;
  };
}

export interface ToggleActiveActionProps extends BaseActionProps {
  isActive?: boolean;
  onToggleActive?: () => Promise<boolean | void>;
}

export interface ApprovalActionProps extends BaseActionProps {
  onApprove?: () => Promise<void>;
  onReject?: () => Promise<void>;
  onDelete?: () => void;
  isApproving?: boolean;
  isRejecting?: boolean;
}

export interface DiscountCodeActionProps extends BaseActionProps {
  onViewDiscountCodes?: () => void;
  onGenerateDiscountCodes?: () => Promise<void>;
  isGeneratingCodes?: boolean;
}
