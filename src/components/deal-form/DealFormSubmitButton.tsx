
import { Button } from "@/components/ui/button";
import { useDealFormContext } from "./DealFormContext";

export const DealFormSubmitButton = () => {
  const { isSubmitting, isGeneratingCodes, initialValues } = useDealFormContext();
  
  const buttonText = () => {
    if (isGeneratingCodes) {
      return "Genererar rabattkoder...";
    }
    if (isSubmitting) {
      return "Sparar...";
    }
    return initialValues ? "Uppdatera erbjudande" : "Skapa erbjudande";
  };
  
  return (
    <div className="pt-4 sticky bottom-0 bg-background">
      <Button 
        type="submit" 
        className="w-full" 
        disabled={isSubmitting || isGeneratingCodes}
      >
        {buttonText()}
      </Button>
    </div>
  );
};
