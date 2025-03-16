
import { Button } from "@/components/ui/button";
import { RefreshCw } from "lucide-react";

interface GenerateTestCodesButtonProps {
  onClick: () => void;
  isLoading: boolean;
  isDisabled: boolean;
}

export const GenerateTestCodesButton = ({ 
  onClick, 
  isLoading, 
  isDisabled 
}: GenerateTestCodesButtonProps) => {
  return (
    <Button
      variant="outline"
      size="sm"
      onClick={onClick}
      disabled={isDisabled}
      className="gap-2 w-full"
    >
      <RefreshCw className={`h-4 w-4 ${isLoading ? "animate-spin" : ""}`} />
      <span>Generera 5 testkoder</span>
    </Button>
  );
};
