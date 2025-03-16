
import { useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { generateDiscountCodes, testDiscountCodeGeneration } from "@/utils/discount-codes";
import { RefreshCw, Bug } from "lucide-react";
import { normalizeId } from "@/utils/discount-codes/types";

interface TestGenerateCodesButtonProps {
  dealId: number | string;
  onSuccess?: () => void;
}

export const TestGenerateCodesButton = ({ dealId, onSuccess }: TestGenerateCodesButtonProps) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [isTesting, setIsTesting] = useState(false);
  
  const handleGenerateTestCodes = useCallback(async () => {
    if (isGenerating) return;
    
    try {
      setIsGenerating(true);
      console.log(`[TestGenerateCodesButton] Generating test codes for deal ID: ${dealId}`);
      
      // Ensure we're using a normalized ID
      const normalizedId = normalizeId(dealId);
      console.log(`[TestGenerateCodesButton] Using normalized deal ID: ${normalizedId} (${typeof normalizedId})`);
      
      // Anropa API för att generera koder
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

  const handleDiagnoseDatabase = useCallback(async () => {
    if (isTesting) return;
    
    try {
      setIsTesting(true);
      const normalizedId = normalizeId(dealId);
      
      toast.info("Diagnostiserar databaskoppling...");
      
      const result = await testDiscountCodeGeneration(normalizedId);
      
      if (result) {
        toast.success("Databastest lyckades! Det går att skapa och ta bort koder.", {
          description: "Problemet ligger troligen i annan kod eller så behövs fler försök."
        });
      } else {
        toast.error("Databastest misslyckades!", {
          description: "Det verkar finnas problem med att skriva till discount_codes tabellen."
        });
      }
      
    } catch (error) {
      console.error("Diagnostik misslyckades:", error);
      toast.error("Diagnostik misslyckades", {
        description: "Ett oväntat fel uppstod vid testet."
      });
    } finally {
      setIsTesting(false);
    }
  }, [dealId, isTesting]);
  
  return (
    <div className="space-y-2">
      <Button
        variant="outline"
        size="sm"
        onClick={handleGenerateTestCodes}
        disabled={isGenerating || isTesting}
        className="gap-2 w-full"
      >
        <RefreshCw className={`h-4 w-4 ${isGenerating ? "animate-spin" : ""}`} />
        <span>Generera 5 testkoder</span>
      </Button>
      
      <Button
        variant="secondary"
        size="sm"
        onClick={handleDiagnoseDatabase}
        disabled={isGenerating || isTesting}
        className="gap-2 w-full"
      >
        <Bug className={`h-4 w-4 ${isTesting ? "animate-spin" : ""}`} />
        <span>Diagnostisera databasanslutning</span>
      </Button>
    </div>
  );
};
