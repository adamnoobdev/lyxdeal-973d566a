
import { useState, useCallback } from "react";
import { toast } from "sonner";
import { generateDiscountCodes } from "@/utils/discount-codes";
import { normalizeId } from "@/utils/discount-codes/types";

export const useTestGenerateActions = (dealId: number | string, onSuccess?: () => void) => {
  const [isGenerating, setIsGenerating] = useState(false);
  
  const handleGenerateTestCodes = useCallback(async () => {
    if (isGenerating) return;
    
    try {
      setIsGenerating(true);
      console.log(`[TestGenerateCodesButton] Generating test codes for deal ID: ${dealId}`);
      
      const normalizedId = normalizeId(dealId);
      console.log(`[TestGenerateCodesButton] Using normalized deal ID: ${normalizedId} (${typeof normalizedId})`);
      
      const result = await toast.promise(
        generateDiscountCodes(normalizedId, 5),
        {
          loading: "Genererar 5 testkoder...",
          success: "5 testkoder genererades",
          error: "Kunde inte generera testkoder"
        }
      );
      
      if (result) {
        console.log(`[TestGenerateCodesButton] Successfully generated test codes`);
        if (onSuccess) {
          onSuccess();
        }
      } else {
        console.error(`[TestGenerateCodesButton] Failed to generate test codes`);
      }
    } catch (error) {
      console.error(`[TestGenerateCodesButton] Error generating test codes:`, error);
    } finally {
      setIsGenerating(false);
    }
  }, [dealId, isGenerating, onSuccess]);

  return {
    isGenerating,
    handleGenerateTestCodes
  };
};
