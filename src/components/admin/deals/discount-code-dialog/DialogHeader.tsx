
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { InfoIcon, RefreshCcw, Bug, Plus } from "lucide-react";
import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger, DialogClose } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

interface GenerateCodesDialogProps {
  onGenerate: (quantity: number) => Promise<void>;
  isGenerating?: boolean;
  onClose: () => void;
}

const GenerateCodesDialog = ({ onGenerate, isGenerating, onClose }: GenerateCodesDialogProps) => {
  const [quantity, setQuantity] = useState(10);
  const [open, setOpen] = useState(false);

  const handleGenerate = async () => {
    try {
      await onGenerate(quantity);
      setOpen(false);
    } catch (error) {
      console.error("Error generating codes:", error);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="flex items-center gap-1">
          <Plus className="h-4 w-4" />
          <span>Generera koder</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Generera rabattkoder</DialogTitle>
          <DialogDescription>
            Ange antal rabattkoder som ska genereras för detta erbjudande.
          </DialogDescription>
        </DialogHeader>
        <div className="py-4">
          <Label htmlFor="quantity" className="mb-2 block">Antal koder</Label>
          <Input 
            id="quantity" 
            type="number"
            min="1"
            max="100"
            value={quantity} 
            onChange={(e) => setQuantity(Math.min(100, Math.max(1, parseInt(e.target.value) || 10)))}
            className="w-full"
          />
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>Avbryt</Button>
          <Button 
            onClick={handleGenerate} 
            disabled={isGenerating}
            className="gap-1"
          >
            {isGenerating ? 'Genererar...' : 'Generera'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

interface DialogHeaderProps {
  title: string;
  dealTitle?: string;
  codesCount: number;
  isLoading?: boolean;
  isFetching?: boolean;
  timeElapsedText?: string;
  onManualRefresh?: () => void;
  onInspectCodes?: () => void;
  isInspecting?: boolean;
  onGenerateDiscountCodes?: (quantity: number) => Promise<void>;
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
  isInspecting,
  onGenerateDiscountCodes
}: DialogHeaderProps) => {
  const [isGenerating, setIsGenerating] = useState(false);

  const handleGenerateCodes = async (quantity: number) => {
    if (!onGenerateDiscountCodes) return;
    
    try {
      setIsGenerating(true);
      await onGenerateDiscountCodes(quantity);
    } catch (error) {
      console.error("Error generating codes:", error);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold">{title}</h2>
          {dealTitle && <p className="text-sm text-muted-foreground">{dealTitle}</p>}
        </div>
        <div className="flex gap-2">
          {onManualRefresh && (
            <Button 
              variant="outline" 
              size="sm" 
              onClick={onManualRefresh}
              disabled={isLoading || isFetching}
              className="flex items-center gap-1"
            >
              <RefreshCcw className={`h-4 w-4 ${isFetching ? "animate-spin" : ""}`} />
              <span className="hidden sm:inline">Uppdatera</span>
            </Button>
          )}
          
          {onInspectCodes && (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={onInspectCodes}
                    disabled={isInspecting}
                    className="flex items-center gap-1"
                  >
                    <Bug className="h-4 w-4" />
                    <span className="hidden sm:inline">Felsök</span>
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Inspektera koderna direkt i databasen</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          )}
          
          {onGenerateDiscountCodes && (
            <GenerateCodesDialog 
              onGenerate={handleGenerateCodes} 
              isGenerating={isGenerating}
              onClose={() => setIsGenerating(false)}
            />
          )}
        </div>
      </div>
      <div className="flex items-center justify-between text-sm text-muted-foreground">
        <div className="flex items-center gap-1">
          <span>
            {codesCount} {codesCount === 1 ? "rabattkod" : "rabattkoder"} hittades
          </span>
          {(isLoading || isFetching) && <span>(laddar...)</span>}
        </div>
        {timeElapsedText && (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <div className="flex items-center gap-1 cursor-help">
                  <InfoIcon className="h-4 w-4" />
                  <span className="hidden sm:inline text-xs">{timeElapsedText}</span>
                </div>
              </TooltipTrigger>
              <TooltipContent>
                <p>Tidsinformation för felsökning</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        )}
      </div>
    </div>
  );
};
