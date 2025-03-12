
import { Deal } from "../types";
import { DealsTable } from "./DealsTable";
import { Badge } from "@/components/ui/badge";
import { Clock } from "lucide-react";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

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
          showApprovalActions={true}
          onApprove={(dealId) => handleStatusChange(dealId, 'approved')}
          onReject={(dealId) => handleStatusChange(dealId, 'rejected')}
        />
        
        <div className="mt-4 flex flex-wrap gap-2">
          {pendingDeals.map(deal => (
            <div key={deal.id} className="flex items-center space-x-2 bg-white p-2 rounded-md shadow-sm border border-amber-100">
              <span className="font-medium text-sm truncate max-w-[150px]">{deal.title}</span>
              <div className="flex space-x-1">
                <Button 
                  size="sm" 
                  variant="outline" 
                  className="h-7 px-2 text-xs border-green-500 text-green-600 hover:bg-green-50"
                  onClick={() => handleStatusChange(deal.id, 'approved')}
                >
                  Godkänn
                </Button>
                <Button 
                  size="sm" 
                  variant="outline" 
                  className="h-7 px-2 text-xs border-red-500 text-red-600 hover:bg-red-50"
                  onClick={() => handleStatusChange(deal.id, 'rejected')}
                >
                  Neka
                </Button>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
