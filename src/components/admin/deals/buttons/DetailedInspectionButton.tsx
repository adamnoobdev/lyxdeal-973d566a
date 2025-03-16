
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";

interface DetailedInspectionButtonProps {
  onClick: () => void;
  isLoading: boolean;
  isDisabled: boolean;
}

export const DetailedInspectionButton = ({ 
  onClick, 
  isLoading, 
  isDisabled 
}: DetailedInspectionButtonProps) => {
  return (
    <Button
      variant="default"
      size="sm"
      onClick={onClick}
      disabled={isDisabled}
      className="gap-2 w-full"
    >
      <Search className={`h-4 w-4 ${isLoading ? "animate-spin" : ""}`} />
      <span>Detaljerad databasinspektion</span>
    </Button>
  );
};
