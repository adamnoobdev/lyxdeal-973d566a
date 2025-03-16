
import { useTestGenerateActions } from "@/hooks/useTestGenerateActions";
import { GenerateTestCodesButton } from "./buttons/GenerateTestCodesButton";

interface TestGenerateCodesButtonProps {
  dealId: number | string;
  onSuccess?: () => void;
}

export const TestGenerateCodesButton = ({ dealId, onSuccess }: TestGenerateCodesButtonProps) => {
  const { isGenerating, handleGenerateTestCodes } = useTestGenerateActions(dealId, onSuccess);
  
  return (
    <GenerateTestCodesButton
      onClick={handleGenerateTestCodes}
      isLoading={isGenerating}
      isDisabled={isGenerating}
    />
  );
};
