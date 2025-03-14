
import { Deal } from "@/components/admin/types";
import { DealsTable } from "./DealsTable";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface PendingDealsSectionProps {
  pendingDeals: Deal[];
  setEditingDeal: (deal: Deal) => void;
  setDeletingDeal: (deal: Deal) => void;
  handleToggleActive: (deal: Deal) => Promise<boolean>;
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
      <CardHeader className="bg-secondary/10 pb-2">
        <CardTitle className="text-lg font-medium">
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
          onApprove={(dealId) => handleApprove(dealId)}
          onReject={(dealId) => handleReject(dealId)}
          onViewDiscountCodes={onViewDiscountCodes}
        />
      </CardContent>
    </Card>
  );
};
