
import { Deal } from "@/components/admin/types";
import { DealsTable } from "./DealsTable";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface PendingDealsSectionProps {
  pendingDeals: Deal[];
  setEditingDeal: (deal: Deal) => void;
  setDeletingDeal: (deal: Deal) => void;
  handleToggleActive: (deal: Deal) => Promise<boolean | void>;
  handleStatusChange: (dealId: number, status: string) => Promise<void>;
  onViewDiscountCodes?: (deal: Deal) => void;
}

export const PendingDealsSection = ({
  pendingDeals,
  setEditingDeal,
  setDeletingDeal,
  handleToggleActive,
  handleStatusChange,
  onViewDiscountCodes
}: PendingDealsSectionProps) => {
  const handleApprove = async (dealId: number) => {
    await handleStatusChange(dealId, 'approved');
  };

  const handleReject = async (dealId: number) => {
    await handleStatusChange(dealId, 'rejected');
  };

  return (
    <Card className="border border-secondary/20 rounded-lg overflow-hidden shadow-sm">
      <CardHeader className="bg-secondary/10 pb-1 sm:pb-2 px-3 sm:px-6 py-2 sm:py-4">
        <CardTitle className="text-base sm:text-lg font-medium">
          Väntande erbjudanden ({pendingDeals.length})
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <DealsTable
          deals={pendingDeals}
          onEdit={setEditingDeal}
          onDelete={setDeletingDeal}
          onToggleActive={handleToggleActive}
          showApprovalActions={true}
          onApprove={handleApprove}
          onReject={handleReject}
          onViewDiscountCodes={onViewDiscountCodes}
        />
      </CardContent>
    </Card>
  );
};
