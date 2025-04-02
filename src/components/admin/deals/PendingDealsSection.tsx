
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DealsList } from "./DealsList";
import { ApprovalActions } from "./actions/ApprovalActions";
import { useIsMobile } from "@/hooks/use-mobile";

export const PendingDealsSection = ({
  pendingDeals,
  setEditingDeal,
  setDeletingDeal,
  handleToggleActive,
  handleStatusChange,
  onViewDiscountCodes,
}) => {
  const isMobile = useIsMobile();
  
  return (
    <Card className="overflow-hidden border shadow-sm">
      <CardHeader className="bg-amber-50 border-b border-amber-100 pb-2">
        <CardTitle className="text-amber-800 text-base font-medium">
          Väntande godkännande ({pendingDeals.length})
        </CardTitle>
      </CardHeader>
      <CardContent className={`${isMobile ? "p-0" : "p-2"} pt-0`}>
        {pendingDeals.length > 0 ? (
          <DealsList
            deals={pendingDeals}
            onEdit={setEditingDeal}
            onDelete={setDeletingDeal}
            onToggleActive={handleToggleActive}
            onViewDiscountCodes={onViewDiscountCodes}
            ActionComponent={ApprovalActions}
            actionProps={{ onStatusChange: handleStatusChange }}
          />
        ) : (
          <div className="text-center py-6 text-muted-foreground">
            Inga erbjudanden väntar på godkännande
          </div>
        )}
      </CardContent>
    </Card>
  );
};
