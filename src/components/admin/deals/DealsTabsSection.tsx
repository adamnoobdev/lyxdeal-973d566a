
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DealsList } from "./DealsList";
import { Card } from "@/components/ui/card";
import { useIsMobile } from "@/hooks/use-mobile";

export const DealsTabsSection = ({
  activeDeals,
  inactiveDeals,
  setEditingDeal,
  setDeletingDeal,
  handleToggleActive,
  onViewDiscountCodes,
  onGenerateDiscountCodes,
  isGeneratingCodes,
}) => {
  const isMobile = useIsMobile();

  return (
    <Card className="overflow-hidden border shadow-sm p-4">
      <Tabs defaultValue="active">
        <TabsList className="mb-4 bg-muted/20 border border-muted/20">
          <TabsTrigger value="active" className="text-sm">
            Aktiva ({activeDeals.length})
          </TabsTrigger>
          <TabsTrigger value="inactive" className="text-sm">
            Inaktiva ({inactiveDeals.length})
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="active" className={isMobile ? "px-0" : "px-1"}>
          {activeDeals.length > 0 ? (
            <DealsList
              deals={activeDeals}
              onEdit={setEditingDeal}
              onDelete={setDeletingDeal}
              onToggleActive={handleToggleActive}
              onViewDiscountCodes={onViewDiscountCodes}
              onGenerateDiscountCodes={onGenerateDiscountCodes}
              isGeneratingCodes={isGeneratingCodes}
            />
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              Inga aktiva erbjudanden att visa
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="inactive" className={isMobile ? "px-0" : "px-1"}>
          {inactiveDeals.length > 0 ? (
            <DealsList
              deals={inactiveDeals}
              onEdit={setEditingDeal}
              onDelete={setDeletingDeal}
              onToggleActive={handleToggleActive}
              onViewDiscountCodes={onViewDiscountCodes}
              onGenerateDiscountCodes={onGenerateDiscountCodes}
              isGeneratingCodes={isGeneratingCodes}
            />
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              Inga inaktiva erbjudanden att visa
            </div>
          )}
        </TabsContent>
      </Tabs>
    </Card>
  );
};
