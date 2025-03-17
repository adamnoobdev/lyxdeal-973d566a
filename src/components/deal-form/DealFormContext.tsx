
import { createContext, useContext, useState, ReactNode } from 'react';
import { FormValues } from './schema';

interface DealFormContextType {
  isSubmitting: boolean;
  setIsSubmitting: (isSubmitting: boolean) => void;
  isGeneratingCodes: boolean;
  setIsGeneratingCodes: (isGeneratingCodes: boolean) => void;
  initialValues?: FormValues;
}

const DealFormContext = createContext<DealFormContextType | undefined>(undefined);

interface DealFormProviderProps {
  children: ReactNode;
  initialValues?: FormValues;
  externalIsSubmitting?: boolean;
}

export const DealFormProvider = ({ 
  children, 
  initialValues,
  externalIsSubmitting = false
}: DealFormProviderProps) => {
  const [isSubmitting, setIsSubmitting] = useState<boolean>(externalIsSubmitting);
  const [isGeneratingCodes, setIsGeneratingCodes] = useState<boolean>(false);
  
  // Log the current provider state
  console.log("[DealFormProvider] Rendering with state:", { 
    isSubmitting, 
    externalIsSubmitting, 
    hasInitialValues: !!initialValues 
  });

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

export const useDealFormContext = (): DealFormContextType => {
  const context = useContext(DealFormContext);
  if (context === undefined) {
    throw new Error('useDealFormContext must be used within a DealFormProvider');
  }
  return context;
};
