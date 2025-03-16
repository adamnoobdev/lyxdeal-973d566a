
import { RefreshCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

interface DiscountDialogHeaderProps {
  title: string;
  codesCount: number;
  isLoading: boolean;
  isFetching: boolean;
  timeElapsedText: string;
  onManualRefresh: () => void;
}

export const DiscountDialogHeader = ({
  title,
  codesCount,
  isLoading,
  isFetching,
  timeElapsedText,
  onManualRefresh
}: DiscountDialogHeaderProps) => {
  return (
    <div className="pb-4">
      <div className="flex flex-col lg:flex-row lg:justify-between lg:items-center gap-4">
        <div>
          <h2 className="text-xl font-bold">{title}</h2>
          
          <div className="flex items-center gap-2 mt-1">
            <span className="text-sm text-muted-foreground">
              {codesCount} rabattkoder
            </span>
            {timeElapsedText && (
              <span className="text-xs text-muted-foreground">
                ({timeElapsedText})
              </span>
            )}
          </div>
        </div>
        
        <div className="flex flex-wrap gap-2">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={onManualRefresh}
            disabled={isFetching}
            className="gap-2"
          >
            <RefreshCcw className={`h-4 w-4 ${isFetching ? "animate-spin" : ""}`} />
            <span>Uppdatera</span>
          </Button>
        </div>
      </div>
      
      <Separator className="my-4" />
    </div>
  );
};
