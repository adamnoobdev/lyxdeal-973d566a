
import { DialogHeader as UIDialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { RefreshCw, Search } from "lucide-react";

interface DialogHeaderProps {
  title: string;
  dealTitle?: string;
  codesCount: number;
  isLoading: boolean;
  isFetching: boolean;
  timeElapsedText?: string;
  onManualRefresh: () => void;
  onInspectCodes: () => void;
  isInspecting: boolean;
}

export const DialogHeader = ({
  title,
  dealTitle,
  codesCount,
  isLoading,
  isFetching,
  timeElapsedText,
  onManualRefresh,
  onInspectCodes,
  isInspecting
}: DialogHeaderProps) => {
  return (
    <UIDialogHeader className="space-y-2">
      <div className="flex items-center justify-between">
        <DialogTitle>{title} - {dealTitle}</DialogTitle>
        <div className="flex items-center gap-2">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={onInspectCodes} 
            disabled={isInspecting || !dealTitle}
            className="flex items-center gap-1"
          >
            <Search className={`h-4 w-4 ${isInspecting ? 'animate-spin' : ''}`} />
            <span>Inspektera databas</span>
          </Button>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={onManualRefresh} 
            disabled={isFetching}
            className="flex items-center gap-1"
          >
            <RefreshCw className={`h-4 w-4 ${isFetching ? 'animate-spin' : ''}`} />
            <span>Uppdatera</span>
          </Button>
        </div>
      </div>
      <DialogDescription>
        Här ser du alla rabattkoder som genererats för detta erbjudande och deras status.
        {codesCount === 0 && !isLoading && !isFetching && (
          <span className="block mt-1 text-amber-500">
            Inga rabattkoder hittades. Använd uppdatera-knappen för att försöka igen.
          </span>
        )}
        {timeElapsedText && (
          <span className="block mt-1 text-xs text-muted-foreground opacity-50">
            {timeElapsedText}
          </span>
        )}
      </DialogDescription>
    </UIDialogHeader>
  );
};
