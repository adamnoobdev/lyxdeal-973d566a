
import { useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { generateDiscountCodes } from "@/utils/discount-codes";
import { RefreshCw } from "lucide-react";

interface TestGenerateCodesButtonProps {
  dealId: number | string;
  onSuccess?: () => void;
}

export const TestGenerateCodesButton = ({ dealId, onSuccess }: TestGenerateCodesButtonProps) => {
  const [isGenerating, setIsGenerating] = useState(false);
  
  const handleGenerateTestCodes = useCallback(async () => {
    if (isGenerating) return;
    
    try {
      setIsGenerating(true);
      console.log(`[TestGenerateCodesButton] Generating test codes for deal ID: ${dealId}`);
      
      // Anropa API för att generera koder
      const result = await toast.promise(
        generateDiscountCodes(dealId, 5),
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
  
  return (
    <Button
      variant="outline"
      size="sm"
      onClick={handleGenerateTestCodes}
      disabled={isGenerating}
      className="gap-2"
    >
      <RefreshCw className={`h-4 w-4 ${isGenerating ? "animate-spin" : ""}`} />
      <span>Generera 5 testkoder</span>
    </Button>
  );
};
