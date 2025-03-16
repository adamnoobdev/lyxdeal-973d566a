
import { Button } from "@/components/ui/button";
import { Bug } from "lucide-react";

interface DiagnoseDatabaseButtonProps {
  onClick: () => void;
  isLoading: boolean;
  isDisabled: boolean;
}

export const DiagnoseDatabaseButton = ({ 
  onClick, 
  isLoading, 
  isDisabled 
}: DiagnoseDatabaseButtonProps) => {
  return (
    <Button
      variant="secondary"
      size="sm"
      onClick={onClick}
      disabled={isDisabled}
      className="gap-2 w-full"
    >
      <Bug className={`h-4 w-4 ${isLoading ? "animate-spin" : ""}`} />
      <span>Diagnostisera databasanslutning</span>
    </Button>
  );
};
