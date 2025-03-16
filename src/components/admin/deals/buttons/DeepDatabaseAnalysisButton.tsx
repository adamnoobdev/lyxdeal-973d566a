
import { Button } from "@/components/ui/button";
import { Database } from "lucide-react";

interface DeepDatabaseAnalysisButtonProps {
  onClick: () => void;
  isLoading: boolean;
  isDisabled: boolean;
}

export const DeepDatabaseAnalysisButton = ({ 
  onClick, 
  isLoading, 
  isDisabled 
}: DeepDatabaseAnalysisButtonProps) => {
  return (
    <Button
      variant="destructive"
      size="sm"
      onClick={onClick}
      disabled={isDisabled}
      className="gap-2 w-full bg-amber-600 hover:bg-amber-700"
    >
      <Database className={`h-4 w-4 ${isLoading ? "animate-spin" : ""}`} />
      <span>Djupgående databasanalys</span>
    </Button>
  );
};
