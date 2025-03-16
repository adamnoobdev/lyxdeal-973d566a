
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

export const DebugPanel = () => {
  const [dealId, setDealId] = useState<string>("");
  const [quantity, setQuantity] = useState<string>("5");
  
  const handleListAllCodes = async () => {
    await listAllDiscountCodes();
    toast.success("Se konsolen för lista över alla rabattkoder");
  };
  
  const handleRemoveAllCodes = async () => {
    const success = await removeAllDiscountCodes(dealId || undefined);
    if (success) {
      toast.success(dealId 
        ? `Alla rabattkoder för erbjudande ${dealId} borttagna` 
        : "Alla rabattkoder borttagna");
    } else {
      toast.error("Kunde inte ta bort rabattkoder");
    }
  };
  
  const handleCountCodes = async () => {
    if (!dealId) {
      toast.error("Ange ett erbjudande-ID");
      return;
    }
    
    const count = await countDiscountCodes(dealId);
    toast.info(`${count} rabattkoder för erbjudande ${dealId}`);
  };
  
  const handleGenerateCodes = async () => {
    if (!dealId) {
      toast.error("Ange ett erbjudande-ID");
      return;
    }
    
    try {
      const numQuantity = parseInt(quantity, 10);
      if (isNaN(numQuantity) || numQuantity <= 0) {
        toast.error("Ange ett giltigt antal");
        return;
      }
      
      const numericDealId = normalizeId(dealId);
      
      const success = await generateDiscountCodes(numericDealId, numQuantity);
      if (success) {
        toast.success(`${numQuantity} rabattkoder genererade för erbjudande ${dealId}`);
      } else {
        toast.error("Kunde inte generera rabattkoder");
      }
    } catch (error) {
      console.error("[DebugPanel] Error generating codes:", error);
      toast.error("Ett fel uppstod vid generering av rabattkoder");
    }
  };
  
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Felsökningsverktyg</CardTitle>
      </CardHeader>
      <CardContent>
        <Accordion type="single" collapsible className="w-full">
          <AccordionItem value="discount-codes">
            <AccordionTrigger>Rabattkoder</AccordionTrigger>
            <AccordionContent>
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
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </CardContent>
    </Card>
  );
};
