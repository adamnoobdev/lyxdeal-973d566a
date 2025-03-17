
export interface BaseActionProps {
  onClick?: () => void;
  disabled?: boolean;
  title?: string;
  onEdit?: () => void;
  onPreview?: () => void;
}

export interface ToggleActiveActionProps extends BaseActionProps {
  isActive?: boolean;
  onToggleActive?: () => Promise<boolean | void>;
}

export interface ApprovalActionProps extends BaseActionProps {
  onApprove?: () => Promise<void>;
  onReject?: () => Promise<void>;
  isApproving?: boolean;
  isRejecting?: boolean;
}

export interface DiscountCodeActionProps extends BaseActionProps {
  onViewDiscountCodes?: () => void;
  onGenerateDiscountCodes?: () => Promise<void>;
  isGeneratingCodes?: boolean;
}
