
import { Deal } from "@/components/admin/types";
import { DealsTable } from "./DealsTable";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";

interface DealsTabsSectionProps {
  activeDeals: Deal[];
  inactiveDeals: Deal[];
  setEditingDeal: (deal: Deal) => void;
  setDeletingDeal: (deal: Deal) => void;
  handleToggleActive: (deal: Deal) => Promise<boolean | void>;
  onViewDiscountCodes?: (deal: Deal) => void;
  onGenerateDiscountCodes?: (deal: Deal, quantity?: number) => Promise<void>;
  isGeneratingCodes?: boolean;
}

export const DealsTabsSection = ({
  activeDeals,
  inactiveDeals,
  setEditingDeal,
  setDeletingDeal,
  handleToggleActive,
  onViewDiscountCodes,
  onGenerateDiscountCodes,
  isGeneratingCodes
}: DealsTabsSectionProps) => {
  return (
    <Card className="border border-secondary/20 rounded-lg overflow-hidden shadow-sm p-4">
      <Tabs defaultValue="active" className="w-full">
        <TabsList className="mb-4 w-full max-w-md bg-secondary/10 border border-secondary/30">
          <TabsTrigger
            value="active"
            className="flex-1 data-[state=active]:bg-white data-[state=active]:text-primary data-[state=active]:shadow-sm"
          >
            Aktiva erbjudanden ({activeDeals.length})
          </TabsTrigger>
          <TabsTrigger
            value="inactive"
            className="flex-1 data-[state=active]:bg-white data-[state=active]:text-primary data-[state=active]:shadow-sm"
          >
            Inaktiva erbjudanden ({inactiveDeals.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="active">
          <DealsTable
            deals={activeDeals}
            onEdit={setEditingDeal}
            onDelete={setDeletingDeal}
            onToggleActive={handleToggleActive}
            onViewDiscountCodes={onViewDiscountCodes}
            onGenerateDiscountCodes={onGenerateDiscountCodes}
            isGeneratingCodes={isGeneratingCodes}
          />
        </TabsContent>

        <TabsContent value="inactive">
          <DealsTable
            deals={inactiveDeals}
            onEdit={setEditingDeal}
            onDelete={setDeletingDeal}
            onToggleActive={handleToggleActive}
            onViewDiscountCodes={onViewDiscountCodes}
            onGenerateDiscountCodes={onGenerateDiscountCodes}
            isGeneratingCodes={isGeneratingCodes}
          />
        </TabsContent>
      </Tabs>
    </Card>
  );
};
