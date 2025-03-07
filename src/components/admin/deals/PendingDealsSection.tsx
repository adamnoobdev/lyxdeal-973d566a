
import { Deal } from "../types";
import { DealsTable } from "./DealsTable";
import { Badge } from "@/components/ui/badge";
import { Clock } from "lucide-react";

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
    <div className="space-y-3 mb-8 bg-amber-50 p-4 rounded-lg border border-amber-200">
      <div className="flex items-center gap-2">
        <Clock className="h-5 w-5 text-amber-500" />
        <h2 className="text-lg font-semibold">Väntande godkännande</h2>
        <Badge variant="secondary" className="ml-auto bg-amber-100 text-amber-800">
          {pendingDeals.length}
        </Badge>
      </div>
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
  );
};
