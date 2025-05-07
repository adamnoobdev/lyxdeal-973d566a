
import { useState } from "react";
import { 
  listAllDiscountCodes, 
  countDiscountCodes
} from "@/utils/discount-codes/debug";
import { generateDiscountCodes } from "@/utils/discount-codes";
import { removeAllDiscountCodes } from "@/utils/discount-codes/removeAllCodes";
import { toast } from "sonner";
import { normalizeId } from "@/utils/discount-codes/types";

export const useDebugPanel = () => {
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

  return {
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
  };
};
