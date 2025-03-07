
import { Deal } from "../types";
import { DealsTable } from "./DealsTable";
import { Badge } from "@/components/ui/badge";
import { Clock } from "lucide-react";
import { Card, CardHeader, CardContent } from "@/components/ui/card";

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
    <Card className="border-amber-200 bg-amber-50/50 mb-8 shadow-sm">
      <CardHeader className="pb-2 pt-4">
        <div className="flex items-center gap-2">
          <Clock className="h-5 w-5 text-amber-500" />
          <h2 className="text-lg font-semibold text-amber-800">Väntande godkännande</h2>
          <Badge variant="outline" className="ml-auto bg-amber-100 text-amber-800 border-amber-200">
            {pendingDeals.length}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        <DealsTable
          deals={pendingDeals}
          onEdit={setEditingDeal}
          onDelete={setDeletingDeal}
          onToggleActive={handleToggleActive}
          showApprovalActions
          onApprove={(dealId) => handleStatusChange(dealId, 'approved')}
          onReject={(dealId) => handleStatusChange(dealId, 'rejected')}
        />
      </CardContent>
    </Card>
  );
};
