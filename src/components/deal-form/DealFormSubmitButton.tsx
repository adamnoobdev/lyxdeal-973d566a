
import { Button } from "@/components/ui/button";
import { useDealFormContext } from "./DealFormContext";
import { useState } from "react";

export const DealFormSubmitButton = () => {
  // Use a try-catch to handle case where context is not available
  let contextValues;
  try {
    contextValues = useDealFormContext();
  } catch (error) {
    // Use fallback state
    console.warn("[DealFormSubmitButton] DealFormContext not available, using fallback values");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isGeneratingCodes, setIsGeneratingCodes] = useState(false);
    
    contextValues = {
      isSubmitting,
      setIsSubmitting,
      isGeneratingCodes,
      setIsGeneratingCodes,
      initialValues: undefined
    };
  }
  
  const { isSubmitting, isGeneratingCodes, initialValues } = contextValues;
  
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
