
import { useState } from "react";
import { Deal } from "@/types/deal";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DealsSection } from "@/components/salon/DealsSection";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CustomersTable } from "@/components/salon/CustomersTable";

interface MainTabsProps {
  pendingDeals: Deal[];
  approvedDeals: Deal[];
  rejectedDeals: Deal[];
  onEdit: (deal: Deal) => void;
  onDelete: (deal: Deal) => void;
  onViewDetails: (deal: Deal) => void;
  onViewDiscountCodes: (deal: Deal) => void;
}

export const MainTabs = ({
  pendingDeals,
  approvedDeals,
  rejectedDeals,
  onEdit,
  onDelete,
  onViewDetails,
  onViewDiscountCodes
}: MainTabsProps) => {
  const [activeTab, setActiveTab] = useState("overview");

  return (
    <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
      <TabsList className="bg-secondary/10 border border-secondary/30">
        <TabsTrigger value="overview">Erbjudanden</TabsTrigger>
        <TabsTrigger value="customers">Kundlista</TabsTrigger>
      </TabsList>

      <TabsContent value="overview" className="space-y-8">
        {/* Erbjudanden-sektioner */}
        <DealsSection
          title="Väntande godkännande"
          deals={pendingDeals}
          alertMessage="Dessa erbjudanden väntar på godkännande från en administratör innan de publiceras."
          onEdit={onEdit}
          onDelete={onDelete}
          onViewDetails={onViewDetails}
          onViewDiscountCodes={onViewDiscountCodes}
        />

        <DealsSection
          title="Aktiva erbjudanden"
          deals={approvedDeals}
          onEdit={onEdit}
          onDelete={onDelete}
          onViewDetails={onViewDetails}
          onViewDiscountCodes={onViewDiscountCodes}
        />

        <DealsSection
          title="Nekade erbjudanden"
          deals={rejectedDeals}
          alertVariant="destructive"
          alertMessage="Dessa erbjudanden har nekats av en administratör. Du kan redigera och skicka in dem igen för ny granskning."
          onEdit={onEdit}
          onDelete={onDelete}
          onViewDetails={onViewDetails}
        />
      </TabsContent>

      <TabsContent value="customers">
        <Card className="border border-secondary/20 rounded-lg overflow-hidden p-4">
          <CardHeader className="p-0 pb-4">
            <CardTitle className="text-xl">Kunder som säkrat dina erbjudanden</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <CustomersTable />
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  );
};
