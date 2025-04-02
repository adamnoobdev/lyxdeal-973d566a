
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
  actionProps = {}
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
    />
  );
};
