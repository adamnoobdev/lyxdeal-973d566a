
import { useTestGenerateActions } from "@/hooks/useTestGenerateActions";
import { GenerateTestCodesButton } from "./buttons/GenerateTestCodesButton";
import { DiagnoseDatabaseButton } from "./buttons/DiagnoseDatabaseButton";
import { DetailedInspectionButton } from "./buttons/DetailedInspectionButton";
import { DeepDatabaseAnalysisButton } from "./buttons/DeepDatabaseAnalysisButton";

interface TestGenerateCodesButtonProps {
  dealId: number | string;
  onSuccess?: () => void;
}

export const TestGenerateCodesButton = ({ dealId, onSuccess }: TestGenerateCodesButtonProps) => {
  const {
    isGenerating,
    isTesting,
    isInspecting,
    isAnalyzing,
    handleGenerateTestCodes,
    handleDiagnoseDatabase,
    handleDetailedInspection,
    handleDeepDatabaseAnalysis
  } = useTestGenerateActions(dealId, onSuccess);
  
  // Any button is loading or disabled when any operation is in progress
  const isAnyOperationInProgress = isGenerating || isTesting || isInspecting || isAnalyzing;
  
  return (
    <div className="space-y-2">
      <GenerateTestCodesButton
        onClick={handleGenerateTestCodes}
        isLoading={isGenerating}
        isDisabled={isAnyOperationInProgress}
      />
      
      <DiagnoseDatabaseButton
        onClick={handleDiagnoseDatabase}
        isLoading={isTesting}
        isDisabled={isAnyOperationInProgress}
      />
      
      <DetailedInspectionButton
        onClick={handleDetailedInspection}
        isLoading={isInspecting}
        isDisabled={isAnyOperationInProgress}
      />
      
      <DeepDatabaseAnalysisButton
        onClick={handleDeepDatabaseAnalysis}
        isLoading={isAnalyzing}
        isDisabled={isAnyOperationInProgress}
      />
    </div>
  );
};
