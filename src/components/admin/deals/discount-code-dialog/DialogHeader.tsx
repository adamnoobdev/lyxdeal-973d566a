
import { RefreshCcw, Database, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { RemoveAllCodesButton } from "./RemoveAllCodesButton";

interface DiscountDialogHeaderProps {
  title: string;
  dealTitle?: string;
  codesCount: number;
  isLoading: boolean;
  isFetching: boolean;
  timeElapsedText?: string;
  onManualRefresh: () => void;
  onInspectCodes: () => void;
  isInspecting: boolean;
  onGenerateDiscountCodes?: (quantity: number) => Promise<void>;
}

export const DiscountDialogHeader = ({ 
  title,
  dealTitle,
  codesCount,
  isLoading,
  isFetching,
  timeElapsedText,
  onManualRefresh,
  onInspectCodes,
  isInspecting,
  onGenerateDiscountCodes,
}: DiscountDialogHeaderProps) => {
  const handleGenerateClick = () => {
    if (onGenerateDiscountCodes) {
      onGenerateDiscountCodes(10);
    }
  };

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold">{title}</h2>
          <p className="text-sm text-muted-foreground">
            {isLoading || isFetching ? 
              "Hämtar rabattkoder..." : 
              `${codesCount} rabattkoder hittades`
            }
            {timeElapsedText && (
              <span className="text-xs text-muted-foreground ml-2">
                ({timeElapsedText})
              </span>
            )}
          </p>
        </div>
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            size="sm" 
            className="gap-1"
            onClick={onManualRefresh}
            disabled={isFetching}
          >
            <RefreshCcw className={`h-4 w-4 ${isFetching ? "animate-spin" : ""}`} />
            <span className="hidden md:inline">Uppdatera</span>
          </Button>
          
          <Button 
            variant="outline" 
            size="sm" 
            className="gap-1"
            onClick={onInspectCodes}
            disabled={isInspecting}
          >
            <Database className="h-4 w-4" />
            <span className="hidden md:inline">Felsök</span>
          </Button>

          {onGenerateDiscountCodes && (
            <Button 
              variant="outline" 
              size="sm" 
              className="gap-1"
              onClick={handleGenerateClick}
            >
              <Plus className="h-4 w-4" />
              <span className="hidden md:inline">Generera koder</span>
            </Button>
          )}
        </div>
      </div>
      <div className="flex justify-end">
        <RemoveAllCodesButton onSuccess={onManualRefresh} />
      </div>
      <hr className="my-2 border-secondary/30" />
    </div>
  );
};
