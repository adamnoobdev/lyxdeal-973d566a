
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useDebugPanel } from "@/hooks/useDebugPanel";
import { DiscountCodesTab } from "./tabs/DiscountCodesTab";
import { HelpTab } from "./tabs/HelpTab";

export const DebugPanel = () => {
  const {
    dealId,
    setDealId,
    quantity,
    setQuantity,
    lastAction,
    lastResult,
    handleListAllCodes,
    handleRemoveAllCodes,
    handleCountCodes,
    handleGenerateCodes
  } = useDebugPanel();
  
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>Felsökningsverktyg</span>
          {lastAction && (
            <Badge variant="outline" className="ml-2 text-xs">
              Senaste åtgärd: {lastAction}
            </Badge>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="rabattkoder">
          <TabsList className="w-full mb-4">
            <TabsTrigger value="rabattkoder" className="flex-1">Rabattkoder</TabsTrigger>
            <TabsTrigger value="hjälp" className="flex-1">Vanliga problem</TabsTrigger>
          </TabsList>
          
          <TabsContent value="rabattkoder">
            <DiscountCodesTab 
              dealId={dealId}
              setDealId={setDealId}
              quantity={quantity}
              setQuantity={setQuantity}
              lastResult={lastResult}
              handleListAllCodes={handleListAllCodes}
              handleCountCodes={handleCountCodes}
              handleGenerateCodes={handleGenerateCodes}
              handleRemoveAllCodes={handleRemoveAllCodes}
            />
          </TabsContent>
          
          <TabsContent value="hjälp">
            <HelpTab />
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};
