
import { Deal } from "../types";
import { DealsTable } from "./DealsTable";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Inbox, Power } from "lucide-react";

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
    <Tabs defaultValue="active" className="w-full">
      <TabsList className="mb-6 w-full max-w-md grid grid-cols-2 bg-white border">
        <TabsTrigger 
          value="active" 
          className="data-[state=active]:bg-primary/5 data-[state=active]:text-primary data-[state=active]:shadow-none px-6 py-3"
        >
          <Power className="h-4 w-4 mr-2 text-green-500" />
          Aktiva ({activeDeals.length})
        </TabsTrigger>
        <TabsTrigger 
          value="inactive"
          className="data-[state=active]:bg-primary/5 data-[state=active]:text-primary data-[state=active]:shadow-none px-6 py-3"
        >
          <Power className="h-4 w-4 mr-2 text-gray-400" />
          Inaktiva ({inactiveDeals.length})
        </TabsTrigger>
      </TabsList>
      
      <TabsContent value="active">
        {!activeDeals.length ? (
          <Alert className="bg-muted/30 border border-primary/10">
            <Inbox className="h-4 w-4 mr-2 text-primary/70" />
            <AlertDescription className="text-primary/70">
              Inga aktiva erbjudanden hittades.
            </AlertDescription>
          </Alert>
        ) : (
          <DealsTable
            deals={activeDeals}
            onEdit={setEditingDeal}
            onDelete={setDeletingDeal}
            onToggleActive={handleToggleActive}
          />
        )}
      </TabsContent>
      
      <TabsContent value="inactive">
        {!inactiveDeals.length ? (
          <Alert className="bg-muted/30 border border-primary/10">
            <Inbox className="h-4 w-4 mr-2 text-primary/70" />
            <AlertDescription className="text-primary/70">
              Inga inaktiva erbjudanden hittades.
            </AlertDescription>
          </Alert>
        ) : (
          <DealsTable
            deals={inactiveDeals}
            onEdit={setEditingDeal}
            onDelete={setDeletingDeal}
            onToggleActive={handleToggleActive}
          />
        )}
      </TabsContent>
    </Tabs>
  );
};
