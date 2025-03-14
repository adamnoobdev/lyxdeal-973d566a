
import { DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { RefreshCw, Database, Clock } from "lucide-react";

interface DialogHeaderProps {
  title: string;
  dealTitle?: string;
  codesCount?: number;
  isLoading: boolean;
  isFetching: boolean;
  timeElapsedText?: string;
  onManualRefresh: () => void;
  onInspectCodes: () => void;
  isInspecting: boolean;
  onGenerateDiscountCodes?: (quantity: number) => Promise<void>;
}

export const DialogHeader = ({
  title,
  dealTitle,
  codesCount = 0,
  isLoading,
  isFetching,
  timeElapsedText,
  onManualRefresh,
  onInspectCodes,
  isInspecting,
  onGenerateDiscountCodes
}: DialogHeaderProps) => {
  const handleGenerateCodes = () => {
    if (onGenerateDiscountCodes) {
      onGenerateDiscountCodes(5);
    }
  };

  return (
    <div className="flex flex-col space-y-1.5 pb-2 border-b">
      <div className="flex items-center justify-between">
        <div>
          <DialogTitle className="text-xl font-semibold">
            {title} {dealTitle && `för "${dealTitle}"`}
          </DialogTitle>
          <p className="text-sm text-muted-foreground mt-1">
            {isLoading || isFetching 
              ? "Laddar rabattkoder..." 
              : codesCount > 0 
                ? `${codesCount} rabattkoder hittades` 
                : "Inga rabattkoder hittades"}
          </p>
          
          {timeElapsedText && (
            <div className="text-xs text-muted-foreground mt-1 flex items-center">
              <Clock className="h-3 w-3 mr-1 inline" />
              {timeElapsedText}
            </div>
          )}
        </div>
        
        <div className="flex items-center space-x-2">
          {onGenerateDiscountCodes && (
            <Button 
              variant="secondary" 
              size="sm"
              onClick={handleGenerateCodes}
              disabled={isLoading || isFetching}
            >
              Generera nya koder
            </Button>
          )}
          
          <Button 
            variant="outline" 
            size="sm"
            onClick={onInspectCodes}
            disabled={isInspecting}
          >
            <Database className="h-4 w-4 mr-1" />
            Inspektera databas
          </Button>
          
          <Button 
            variant="outline" 
            size="sm"
            onClick={onManualRefresh}
            disabled={isLoading || isFetching}
          >
            <RefreshCw 
              className={`h-4 w-4 mr-1 ${(isLoading || isFetching) ? "animate-spin" : ""}`} 
            />
            Uppdatera
          </Button>
        </div>
      </div>
    </div>
  );
};
