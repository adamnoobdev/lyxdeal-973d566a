
import { useTestGenerateActions } from "@/hooks/useTestGenerateActions";
import { GenerateTestCodesButton } from "./buttons/GenerateTestCodesButton";
import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";

interface TestGenerateCodesButtonProps {
  dealId: number | string;
  onSuccess?: () => void;
  showCounter?: boolean;
}

export const TestGenerateCodesButton = ({ 
  dealId, 
  onSuccess,
  showCounter = false 
}: TestGenerateCodesButtonProps) => {
  const [generatedCount, setGeneratedCount] = useState(0);
  const { isGenerating, handleGenerateTestCodes } = useTestGenerateActions(
    dealId, 
    () => {
      setGeneratedCount(prev => prev + 5);
      toast.success("5 rabattkoder har genererats", {
        description: "Rabattkoderna har lagts till och kan nu användas"
      });
      if (onSuccess) onSuccess();
    }
  );
  
  return (
    <div className="flex items-center gap-2">
      <GenerateTestCodesButton
        onClick={handleGenerateTestCodes}
        isLoading={isGenerating}
        isDisabled={isGenerating}
      />
      
      {showCounter && generatedCount > 0 && (
        <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
          {generatedCount} koder genererade
        </Badge>
      )}
    </div>
  );
};
