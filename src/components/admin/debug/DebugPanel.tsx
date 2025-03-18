
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  listAllDiscountCodes, 
  removeAllDiscountCodes, 
  countDiscountCodes,
  generateDiscountCodes
} from "@/utils/discount-codes";
import { toast } from "sonner";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { normalizeId } from "@/utils/discount-codes/types";
import { Badge } from "@/components/ui/badge";
import { AlertCircle, Database, HelpCircle } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";

export const DebugPanel = () => {
  const [dealId, setDealId] = useState<string>("");
  const [quantity, setQuantity] = useState<string>("5");
  const [lastAction, setLastAction] = useState<string>("");
  const [lastResult, setLastResult] = useState<string>("");
  
  const handleListAllCodes = async () => {
    setLastAction("Lista alla koder");
    const codes = await listAllDiscountCodes();
    setLastResult(`Hittade ${codes.length || 0} rabattkoder totalt`);
    toast.success("Se konsolen för lista över alla rabattkoder");
  };
  
  const handleRemoveAllCodes = async () => {
    setLastAction("Ta bort koder");
    
    const success = await removeAllDiscountCodes(dealId || undefined);
    if (success) {
      const message = dealId 
        ? `Alla rabattkoder för erbjudande ${dealId} borttagna` 
        : "Alla rabattkoder borttagna";
        
      setLastResult(message);
      toast.success(message);
    } else {
      setLastResult("Kunde inte ta bort rabattkoder");
      toast.error("Kunde inte ta bort rabattkoder");
    }
  };
  
  const handleCountCodes = async () => {
    if (!dealId) {
      toast.error("Ange ett erbjudande-ID");
      return;
    }
    
    setLastAction("Räkna koder");
    const count = await countDiscountCodes(dealId);
    const message = `${count} rabattkoder för erbjudande ${dealId}`;
    setLastResult(message);
    toast.info(message);
  };
  
  const handleGenerateCodes = async () => {
    if (!dealId) {
      toast.error("Ange ett erbjudande-ID");
      return;
    }
    
    setLastAction("Generera koder");
    
    try {
      const numQuantity = parseInt(quantity, 10);
      if (isNaN(numQuantity) || numQuantity <= 0) {
        toast.error("Ange ett giltigt antal");
        return;
      }
      
      const numericDealId = normalizeId(dealId);
      
      const success = await generateDiscountCodes(numericDealId, numQuantity);
      if (success) {
        const message = `${numQuantity} rabattkoder genererade för erbjudande ${dealId}`;
        setLastResult(message);
        toast.success(message);
      } else {
        setLastResult("Kunde inte generera rabattkoder");
        toast.error("Kunde inte generera rabattkoder");
      }
    } catch (error) {
      console.error("[DebugPanel] Error generating codes:", error);
      setLastResult("Ett fel uppstod vid generering av rabattkoder");
      toast.error("Ett fel uppstod vid generering av rabattkoder");
    }
  };
  
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
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm">Erbjudande-ID (valfritt)</label>
                  <Input
                    value={dealId}
                    onChange={(e) => setDealId(e.target.value)}
                    placeholder="Erbjudande-ID"
                    className="mt-1"
                  />
                </div>
                <div>
                  <label className="text-sm">Antal</label>
                  <Input
                    value={quantity}
                    onChange={(e) => setQuantity(e.target.value)}
                    placeholder="Antal koder"
                    className="mt-1"
                  />
                </div>
              </div>
              
              <div className="flex flex-wrap gap-2">
                <Button variant="outline" onClick={handleListAllCodes}>
                  Lista alla koder
                </Button>
                <Button variant="outline" onClick={handleCountCodes}>
                  Räkna koder
                </Button>
                <Button variant="outline" onClick={handleGenerateCodes}>
                  Generera koder
                </Button>
                <Button variant="destructive" onClick={handleRemoveAllCodes}>
                  Ta bort koder
                </Button>
              </div>
              
              {lastResult && (
                <Alert className="mt-4 bg-gray-50">
                  <Database className="h-4 w-4" />
                  <AlertDescription>
                    {lastResult}
                  </AlertDescription>
                </Alert>
              )}
            </div>
          </TabsContent>
          
          <TabsContent value="hjälp">
            <Accordion type="single" collapsible className="w-full">
              <AccordionItem value="no-codes">
                <AccordionTrigger className="text-left">
                  <div className="flex items-center">
                    <AlertCircle className="h-4 w-4 mr-2 text-amber-500" />
                    Inga rabattkoder hittas för ett erbjudande
                  </div>
                </AccordionTrigger>
                <AccordionContent>
                  <div className="space-y-2 text-sm">
                    <p>Om det inte finns några rabattkoder för ett erbjudande kan det bero på:</p>
                    <ol className="list-decimal pl-5 space-y-1">
                      <li>Rabattkoder har aldrig genererats för erbjudandet</li>
                      <li>Erbjudandets ID matchar inte det ID som används för sökning</li>
                      <li>Rabattkoderna har tagits bort manuellt</li>
                    </ol>
                    <p className="mt-2">Lösning:</p>
                    <ol className="list-decimal pl-5 space-y-1">
                      <li>Kontrollera att du använder rätt erbjudande-ID</li>
                      <li>Använd "Lista alla koder" för att se vilka rabattkoder som finns</li>
                      <li>Generera nya rabattkoder med knappen "Generera koder"</li>
                    </ol>
                  </div>
                </AccordionContent>
              </AccordionItem>
              
              <AccordionItem value="id-mismatch">
                <AccordionTrigger className="text-left">
                  <div className="flex items-center">
                    <AlertCircle className="h-4 w-4 mr-2 text-amber-500" />
                    Problem med ID-format i databasen
                  </div>
                </AccordionTrigger>
                <AccordionContent>
                  <div className="space-y-2 text-sm">
                    <p>Om ID-formatet för erbjudanden inte stämmer överens kan det orsaka problem:</p>
                    <ol className="list-decimal pl-5 space-y-1">
                      <li>ID lagras som text i en tabell men som nummer i en annan</li>
                      <li>ID:t har extra tecken eller formatering som påverkar sökningen</li>
                    </ol>
                    <p className="mt-2">Lösning:</p>
                    <ol className="list-decimal pl-5 space-y-1">
                      <li>Använd inspektion för att se vilket format ID:t har i databasen</li>
                      <li>Se till att alla ID:n lagras i samma format (helst som nummer)</li>
                      <li>Generera nya rabattkoder med rätt ID-format</li>
                    </ol>
                  </div>
                </AccordionContent>
              </AccordionItem>
              
              <AccordionItem value="general-tips">
                <AccordionTrigger className="text-left">
                  <div className="flex items-center">
                    <HelpCircle className="h-4 w-4 mr-2 text-blue-500" />
                    Allmänna tips för felsökning
                  </div>
                </AccordionTrigger>
                <AccordionContent>
                  <div className="space-y-2 text-sm">
                    <ol className="list-decimal pl-5 space-y-1">
                      <li>Öppna konsolfönstret i webbläsaren för att se detaljerade felmeddelanden</li>
                      <li>Använd inspektionsverktyget för att se exakt vilka koder som finns i databasen</li>
                      <li>Om allt annat misslyckas, generera nya rabattkoder för erbjudandet</li>
                      <li>Kontrollera att erbjudandet har rätt status och är aktivt</li>
                    </ol>
                  </div>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};
