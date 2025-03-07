
import { Deal } from "../types";
import { DealsTable } from "./DealsTable";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface DealsTabsSectionProps {
  activeDeals: Deal[];
  inactiveDeals: Deal[];
  setEditingDeal: (deal: Deal) => void;
  setDeletingDeal: (deal: Deal) => void;
  handleToggleActive: (deal: Deal) => void;
}

export const DealsTabsSection = ({
  activeDeals,
  inactiveDeals,
  setEditingDeal,
  setDeletingDeal,
  handleToggleActive
}: DealsTabsSectionProps) => {
  return (
    <div className="space-y-4">
      <Tabs defaultValue="active" className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="active">
            Aktiva erbjudanden ({activeDeals.length})
          </TabsTrigger>
          <TabsTrigger value="inactive">
            Inaktiva erbjudanden ({inactiveDeals.length})
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="active">
          {!activeDeals.length ? (
            <Alert>
              <AlertDescription>
                Inga aktiva erbjudanden hittades. Skapa ditt första erbjudande genom att klicka på "Skapa erbjudande" ovan.
              </AlertDescription>
            </Alert>
          ) : (
            <div className="overflow-x-auto rounded-lg border bg-background">
              <DealsTable
                deals={activeDeals}
                onEdit={setEditingDeal}
                onDelete={setDeletingDeal}
                onToggleActive={handleToggleActive}
              />
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="inactive">
          {!inactiveDeals.length ? (
            <Alert>
              <AlertDescription>
                Inga inaktiva erbjudanden hittades.
              </AlertDescription>
            </Alert>
          ) : (
            <div className="overflow-x-auto rounded-lg border bg-background">
              <DealsTable
                deals={inactiveDeals}
                onEdit={setEditingDeal}
                onDelete={setDeletingDeal}
                onToggleActive={handleToggleActive}
              />
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};
