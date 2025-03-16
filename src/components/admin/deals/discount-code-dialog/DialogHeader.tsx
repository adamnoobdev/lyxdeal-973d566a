
import { RefreshCcw, PlusCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useState } from "react";
import { DiscountCodesGenerationDialog } from "@/components/discount-codes/DiscountCodesGenerationDialog";

interface DiscountDialogHeaderProps {
  title: string;
  dealTitle?: string;
  codesCount: number;
  isLoading: boolean;
  isFetching: boolean;
  timeElapsedText: string;
  onManualRefresh: () => void;
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
  onGenerateDiscountCodes
}: DiscountDialogHeaderProps) => {
  const [isGeneratorOpen, setIsGeneratorOpen] = useState(false);

  return (
    <div className="pb-4">
      <div className="flex flex-col lg:flex-row lg:justify-between lg:items-center gap-4">
        <div>
          <h2 className="text-xl font-bold">{title}</h2>
          {dealTitle && <p className="text-muted-foreground text-sm">{dealTitle}</p>}
          
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
          
          {onGenerateDiscountCodes && (
            <Button 
              variant="default" 
              size="sm" 
              onClick={() => setIsGeneratorOpen(true)}
              className="gap-2"
            >
              <PlusCircle className="h-4 w-4" />
              <span>Generera koder</span>
            </Button>
          )}
        </div>
      </div>
      
      <Separator className="my-4" />
      
      {onGenerateDiscountCodes && (
        <DiscountCodesGenerationDialog
          isOpen={isGeneratorOpen}
          onClose={() => setIsGeneratorOpen(false)}
          onGenerate={(quantity) => {
            onGenerateDiscountCodes(quantity);
            setIsGeneratorOpen(false);
          }}
          dealTitle={dealTitle}
        />
      )}
    </div>
  );
};
