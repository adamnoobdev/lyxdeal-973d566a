
import { createContext, useContext, useState } from "react";
import { FormValues } from "./schema";

interface DealFormContextType {
  isSubmitting: boolean;
  setIsSubmitting: (value: boolean) => void;
  isGeneratingCodes: boolean;
  setIsGeneratingCodes: (value: boolean) => void;
  initialValues?: FormValues;
}

const DealFormContext = createContext<DealFormContextType | undefined>(undefined);

export const DealFormProvider = ({ 
  children, 
  initialValues 
}: { 
  children: React.ReactNode;
  initialValues?: FormValues;
}) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isGeneratingCodes, setIsGeneratingCodes] = useState(false);

  return (
    <DealFormContext.Provider value={{
      isSubmitting,
      setIsSubmitting,
      isGeneratingCodes,
      setIsGeneratingCodes,
      initialValues
    }}>
      {children}
    </DealFormContext.Provider>
  );
};

export const useDealFormContext = () => {
  const context = useContext(DealFormContext);
  if (context === undefined) {
    throw new Error("useDealFormContext must be used within a DealFormProvider");
  }
  return context;
};
