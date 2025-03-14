
import { X, RefreshCcw, Database, HelpCircle, Plus } from "lucide-react";
import { DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { RemoveAllCodesButton } from "./RemoveAllCodesButton";
import { DiscountCodesGenerationDialog } from "@/components/discount-codes/DiscountCodesGenerationDialog";
import { useState } from "react";

interface DiscountDialogHeaderProps {
  title: string;
  dealTitle?: string;
  codesCount: number;
  isLoading: boolean;
  isFetching: boolean;
  timeElapsedText?: string;
  onManualRefresh: () => void;
  onInspectCodes?: () => void;
  isInspecting?: boolean;
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
  const [isGenerationDialogOpen, setIsGenerationDialogOpen] = useState(false);
  
  return (
    <DialogHeader className="space-y-4">
      <div className="flex items-center justify-between">
        <DialogTitle className="text-xl font-bold">{title}</DialogTitle>
      </div>
      
      {dealTitle && (
        <p className="text-sm text-muted-foreground">
          {dealTitle} - {codesCount} rabattkoder
          {timeElapsedText && (
            <span className="ml-2 text-xs italic">({timeElapsedText})</span>
          )}
        </p>
      )}
      
      <div className="flex flex-wrap gap-2 pt-1">
        <Button 
          variant="outline" 
          size="sm"
          className="flex items-center gap-2"
          onClick={onManualRefresh}
          disabled={isFetching}
        >
          <RefreshCcw className={`h-4 w-4 ${isFetching ? "animate-spin" : ""}`} />
          <span>Uppdatera</span>
        </Button>
        
        {onInspectCodes && (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button 
                  variant="outline" 
                  size="sm"
                  className="flex items-center gap-2"
                  onClick={onInspectCodes}
                  disabled={isInspecting}
                >
                  <Database className="h-4 w-4" />
                  <span>Inspektera</span>
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Inspektera rabattkoder i databasen</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        )}
        
        {onGenerateDiscountCodes && (
          <>
            <Button 
              variant="default" 
              size="sm"
              className="flex items-center gap-2"
              onClick={() => setIsGenerationDialogOpen(true)}
            >
              <Plus className="h-4 w-4" />
              <span>Generera koder</span>
            </Button>
            
            <DiscountCodesGenerationDialog
              isOpen={isGenerationDialogOpen}
              onClose={() => setIsGenerationDialogOpen(false)}
              onGenerate={onGenerateDiscountCodes}
            />
          </>
        )}
        
        <RemoveAllCodesButton onSuccess={onManualRefresh} />
        
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button 
                variant="outline" 
                size="sm"
                className="flex items-center gap-2 ml-auto"
              >
                <HelpCircle className="h-4 w-4" />
                <span>Hjälp</span>
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Rabattkoder används för att kunder ska kunna lösa in erbjudanden</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
    </DialogHeader>
  );
};
