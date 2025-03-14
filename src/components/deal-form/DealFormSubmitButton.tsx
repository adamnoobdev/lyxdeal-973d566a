
import { Button } from "@/components/ui/button";
import { useDealFormContext } from "./DealFormContext";

export const DealFormSubmitButton = () => {
  const { isSubmitting, isGeneratingCodes } = useDealFormContext();
  
  return (
    <div className="pt-4 sticky bottom-0 bg-background">
      <Button 
        type="submit" 
        className="w-full" 
        disabled={isSubmitting || isGeneratingCodes}
      >
        {isGeneratingCodes 
          ? "Genererar rabattkoder..." 
          : isSubmitting 
            ? "Sparar..." 
            : "Spara erbjudande"}
      </Button>
    </div>
  );
};
