
import { Deal } from "@/types/deal";
import { DealsTable } from "./DealsTable";

interface DealsListProps {
  deals: Deal[];
  onEdit?: (deal: Deal) => void;
  onDelete?: (deal: Deal) => void;
  onToggleActive?: (deal: Deal) => Promise<boolean | void>;
  onViewDiscountCodes?: (deal: Deal) => void;
  onGenerateDiscountCodes?: (deal: Deal, quantity?: number) => Promise<void>;
  isGeneratingCodes?: boolean;
  ActionComponent?: React.ComponentType<any>;
  actionProps?: Record<string, any>;
  onPreview?: (deal: Deal) => void;
  isSalonView?: boolean;
  renderActions?: (deal: Deal) => {
    onPreview?: () => void;
    onEdit?: () => void;
    onApprove?: () => Promise<void>;
    onReject?: () => Promise<void>;
  };
}

export const DealsList: React.FC<DealsListProps> = ({ 
  deals, 
  onEdit, 
  onDelete, 
  onToggleActive,
  onViewDiscountCodes,
  onGenerateDiscountCodes,
  isGeneratingCodes,
  ActionComponent,
  actionProps = {},
  renderActions,
  onPreview,
  isSalonView
}) => {
  return (
    <DealsTable 
      deals={deals}
      onEdit={onEdit}
      onDelete={onDelete}
      onToggleActive={onToggleActive}
      onViewDiscountCodes={onViewDiscountCodes}
      onGenerateDiscountCodes={onGenerateDiscountCodes}
      isGeneratingCodes={isGeneratingCodes}
      renderActions={renderActions}
      onPreview={onPreview}
      isSalonView={isSalonView}
    />
  );
};
