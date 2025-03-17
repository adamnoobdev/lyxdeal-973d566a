
import { Check, Edit, Eye, X } from "lucide-react";
import { ApprovalActionProps } from "./types";
import { ActionButton } from "./ActionButton";
import { useState } from "react";

export const ApprovalActions = ({ 
  onEdit, 
  onPreview, 
  onApprove, 
  onReject,
}: ApprovalActionProps) => {
  const [isApproving, setIsApproving] = useState(false);
  const [isRejecting, setIsRejecting] = useState(false);

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
        variant="default"
        onClick={handleApprove}
        loading={isApproving}
        className="h-8 w-8 bg-green-600 hover:bg-green-700"
        title="Godkänn erbjudande"
      >
        <Check className="h-4 w-4" />
      </ActionButton>

      <ActionButton
        onClick={handleReject}
        loading={isRejecting}
        className="h-8 w-8 text-red-500 hover:bg-red-50 hover:text-red-600 border-red-200"
        title="Neka erbjudande"
      >
        <X className="h-4 w-4" />
      </ActionButton>
    </div>
  );
};
