
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
      <TabsList className="mb-4 w-full max-w-md bg-muted/50">
        <TabsTrigger value="active" className="flex-1 data-[state=active]:bg-white data-[state=active]:shadow-sm">
          <Power className="h-4 w-4 mr-2 text-green-500" />
          Aktiva ({activeDeals.length})
        </TabsTrigger>
        <TabsTrigger value="inactive" className="flex-1 data-[state=active]:bg-white data-[state=active]:shadow-sm">
          <Power className="h-4 w-4 mr-2 text-gray-400" />
          Inaktiva ({inactiveDeals.length})
        </TabsTrigger>
      </TabsList>
      
      <TabsContent value="active">
        {!activeDeals.length ? (
          <Alert className="bg-muted border-muted-foreground/20">
            <Inbox className="h-4 w-4 mr-2" />
            <AlertDescription>
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
          <Alert className="bg-muted border-muted-foreground/20">
            <Inbox className="h-4 w-4 mr-2" />
            <AlertDescription>
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
