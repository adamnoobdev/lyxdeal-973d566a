import { useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { generateDiscountCodes, testDiscountCodeGeneration, inspectDiscountCodes } from "@/utils/discount-codes";
import { RefreshCw, Bug, Search, AlertCircle, Database } from "lucide-react";
import { normalizeId, compareIds } from "@/utils/discount-codes/types";
import { supabase } from "@/integrations/supabase/client";

interface TestGenerateCodesButtonProps {
  dealId: number | string;
  onSuccess?: () => void;
}

export const TestGenerateCodesButton = ({ dealId, onSuccess }: TestGenerateCodesButtonProps) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [isTesting, setIsTesting] = useState(false);
  const [isInspecting, setIsInspecting] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  
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
  
  const handleDetailedInspection = useCallback(async () => {
    if (isInspecting) return;
    
    try {
      setIsInspecting(true);
      toast.info("Inspekterar databas och rabattkoder i detalj...");
      
      // Använd original dealId för att bevara typ
      const result = await inspectDiscountCodes(dealId);
      
      if (result.success) {
        toast.success(`Hittade ${result.codesCount} rabattkoder i databasen`, {
          description: `Kodtyp: ${result.codeType || 'varierande'}, exempel: ${result.sampleCodes?.map((c: any) => c.code).join(', ')}`
        });
      } else if (result.codesFoundForDeals) {
        toast.warning("Hittade rabattkoder men inte för detta erbjudande", {
          description: `Koder finns för erbjudanden: ${result.codesFoundForDeals.join(', ')}`
        });
      } else {
        toast.warning(result.message, {
          description: "Kontrollera loggen för mer information"
        });
      }
      
      // Visa detaljerad information i konsolen för felsökning
      console.log("[TestGenerateCodesButton] Detailed inspection result:", result);
      
    } catch (error) {
      console.error("Detaljerad inspektion misslyckades:", error);
      toast.error("Inspektion misslyckades", {
        description: "Ett oväntat fel uppstod vid inspektionen."
      });
    } finally {
      setIsInspecting(false);
    }
  }, [dealId, isInspecting]);

  const handleDeepDatabaseAnalysis = useCallback(async () => {
    if (isAnalyzing) return;
    
    try {
      setIsAnalyzing(true);
      toast.info("Utför djupgående databasanalys...", {
        description: "Detta kan ta några sekunder"
      });
      
      // Använd båda ID-formaten för jämförelse
      const originalId = dealId;
      const numericId = normalizeId(dealId);
      const stringId = String(dealId);
      
      console.log(`[DeepAnalysis] Original ID: ${originalId} (${typeof originalId})`);
      console.log(`[DeepAnalysis] Numeric ID: ${numericId} (${typeof numericId})`);
      console.log(`[DeepAnalysis] String ID: ${stringId} (${typeof stringId})`);
      
      // Hämta alla koder först
      const { data: allCodes, error: codesError } = await supabase
        .from("discount_codes")
        .select("*")
        .limit(100);
      
      if (codesError) {
        console.error("[DeepAnalysis] Error fetching codes:", codesError);
        toast.error("Kunde inte hämta rabattkoder från databasen");
        return;
      }
      
      if (!allCodes || allCodes.length === 0) {
        toast.warning("Inga rabattkoder hittades i databasen");
        return;
      }
      
      console.log(`[DeepAnalysis] Found ${allCodes.length} codes in database`);
      
      // Visa exempel på koder
      console.log("[DeepAnalysis] First 5 codes:", allCodes.slice(0, 5));
      
      // Samla alla unika deal_ids och deras typer
      const dealIds = [...new Set(allCodes.map(c => c.deal_id))];
      const dealIdTypes = [...new Set(allCodes.map(c => typeof c.deal_id))];
      
      // Testa manuell jämförelse
      const matchingCodes = allCodes.filter(code => {
        return compareIds(code.deal_id, dealId);
      });
      
      if (matchingCodes.length > 0) {
        console.log(`[DeepAnalysis] Found ${matchingCodes.length} matching codes using flexible comparison`);
        
        // Visa exempel på matchande koder
        console.log("[DeepAnalysis] Matching codes:", matchingCodes.slice(0, 5));
        
        toast.success(`Hittade ${matchingCodes.length} rabattkoder med flexibel jämförelse`, {
          description: "Koder finns i databasen men matchning behöver förbättras."
        });
      } else {
        console.log(`[DeepAnalysis] No matching codes found with flexible comparison`);
        
        toast.warning("Inga matchande rabattkoder hittades med flexibel jämförelse", {
          description: `Alla deal_ids i databasen: ${dealIds.join(', ')}`
        });
      }
      
      // Visa detaljerad analytics
      toast.info("Databasanalys slutförd", {
        description: `Databastyper: ${dealIdTypes.join(', ')}, Din ID-typ: ${typeof dealId}`
      });
      
    } catch (error) {
      console.error("Djupgående analys misslyckades:", error);
      toast.error("Databasanalys misslyckades", {
        description: "Ett oväntat fel uppstod vid analysen."
      });
    } finally {
      setIsAnalyzing(false);
    }
  }, [dealId, isAnalyzing]);
  
  return (
    <div className="space-y-2">
      <Button
        variant="outline"
        size="sm"
        onClick={handleGenerateTestCodes}
        disabled={isGenerating || isTesting || isInspecting || isAnalyzing}
        className="gap-2 w-full"
      >
        <RefreshCw className={`h-4 w-4 ${isGenerating ? "animate-spin" : ""}`} />
        <span>Generera 5 testkoder</span>
      </Button>
      
      <Button
        variant="secondary"
        size="sm"
        onClick={handleDiagnoseDatabase}
        disabled={isGenerating || isTesting || isInspecting || isAnalyzing}
        className="gap-2 w-full"
      >
        <Bug className={`h-4 w-4 ${isTesting ? "animate-spin" : ""}`} />
        <span>Diagnostisera databasanslutning</span>
      </Button>
      
      <Button
        variant="default"
        size="sm"
        onClick={handleDetailedInspection}
        disabled={isGenerating || isTesting || isInspecting || isAnalyzing}
        className="gap-2 w-full"
      >
        <Search className={`h-4 w-4 ${isInspecting ? "animate-spin" : ""}`} />
        <span>Detaljerad databasinspektion</span>
      </Button>
      
      <Button
        variant="destructive"
        size="sm"
        onClick={handleDeepDatabaseAnalysis}
        disabled={isGenerating || isTesting || isInspecting || isAnalyzing}
        className="gap-2 w-full bg-amber-600 hover:bg-amber-700"
      >
        <Database className={`h-4 w-4 ${isAnalyzing ? "animate-spin" : ""}`} />
        <span>Djupgående databasanalys</span>
      </Button>
    </div>
  );
};
