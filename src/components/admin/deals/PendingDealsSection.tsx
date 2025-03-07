
import { Deal } from "../types";
import { DealsTable } from "./DealsTable";
import { Badge } from "@/components/ui/badge";

interface PendingDealsSectionProps {
  pendingDeals: Deal[];
  setEditingDeal: (deal: Deal) => void;
  setDeletingDeal: (deal: Deal) => void;
  handleToggleActive: (deal: Deal) => void;
  handleStatusChange: (dealId: number, newStatus: 'approved' | 'rejected') => void;
}

export const PendingDealsSection = ({
  pendingDeals,
  setEditingDeal,
  setDeletingDeal,
  handleToggleActive,
  handleStatusChange
}: PendingDealsSectionProps) => {
  if (!pendingDeals.length) return null;
  
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">Väntande godkännande</h2>
        <Badge variant="secondary">{pendingDeals.length}</Badge>
      </div>
      <div className="overflow-x-auto rounded-lg border bg-background">
        <DealsTable
          deals={pendingDeals}
          onEdit={setEditingDeal}
          onDelete={setDeletingDeal}
          onToggleActive={handleToggleActive}
          showApprovalActions
          onApprove={(dealId) => handleStatusChange(dealId, 'approved')}
          onReject={(dealId) => handleStatusChange(dealId, 'rejected')}
        />
      </div>
    </div>
  );
};
