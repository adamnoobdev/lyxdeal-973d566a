
import { Button } from "@/components/ui/button";
import { RefreshCcw, Database, PlusCircle, Trash2, HelpCircle } from "lucide-react";
import { DiscountCodesGenerationDialog } from "@/components/discount-codes/DiscountCodesGenerationDialog";
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
  onGenerateDiscountCodes
}: DiscountDialogHeaderProps) => {
  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-2xl font-bold text-primary">{title}</h2>
        <div className="flex items-center justify-between mt-1">
          <div className="flex items-center gap-2">
            <p className="text-muted-foreground text-sm">
              {dealTitle && dealTitle.length > 0 ? dealTitle : "Erbjudande"} - {codesCount} rabattkoder
            </p>
            {timeElapsedText && (
              <span className="text-xs text-muted-foreground">({timeElapsedText})</span>
            )}
          </div>
        </div>
      </div>
      
      <div className="flex flex-wrap gap-2">
        <Button
          variant="outline"
          size="sm"
          className="gap-2"
          onClick={onManualRefresh}
          disabled={isFetching}
        >
          <RefreshCcw className={`h-4 w-4 ${isFetching ? "animate-spin" : ""}`} />
          <span>Uppdatera</span>
        </Button>
        
        <Button
          variant="outline"
          size="sm"
          className="gap-2"
          onClick={onInspectCodes}
          disabled={isInspecting}
        >
          <Database className={`h-4 w-4 ${isInspecting ? "animate-spin" : ""}`} />
          <span>Inspektera</span>
        </Button>
        
        {onGenerateDiscountCodes && (
          <Button
            variant="default"
            size="sm"
            className="gap-2 bg-purple-900 hover:bg-purple-800"
            onClick={() => onGenerateDiscountCodes(10)}
            disabled={isFetching || isLoading}
          >
            <PlusCircle className="h-4 w-4" />
            <span>Generera koder</span>
          </Button>
        )}
        
        <RemoveAllCodesButton />
        
        <Button
          variant="outline"
          size="sm"
          className="gap-2 ml-auto"
        >
          <HelpCircle className="h-4 w-4" />
          <span>Hjälp</span>
        </Button>
      </div>
    </div>
  );
};
