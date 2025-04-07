
import React, { createContext, useContext, useState, ReactNode } from 'react';
import { FormValues } from './schema';

interface DealFormContextType {
  isSubmitting: boolean;
  isGeneratingCodes?: boolean;
  initialValues?: FormValues;
  setIsSubmitting: (isSubmitting: boolean) => void;
  setIsGeneratingCodes?: (isGenerating: boolean) => void;
}

const DealFormContext = createContext<DealFormContextType | undefined>(undefined);

interface DealFormProviderProps {
  children: ReactNode;
  initialValues?: FormValues;
  externalIsSubmitting?: boolean;
  externalIsGeneratingCodes?: boolean;
}

export const DealFormProvider: React.FC<DealFormProviderProps> = ({
  children,
  initialValues,
  externalIsSubmitting = false,
  externalIsGeneratingCodes = false,
}) => {
  const [isSubmitting, setIsSubmitting] = useState(externalIsSubmitting);
  const [isGeneratingCodes, setIsGeneratingCodes] = useState(externalIsGeneratingCodes);
  
  // Update internal state when external state changes
  React.useEffect(() => {
    setIsSubmitting(externalIsSubmitting);
  }, [externalIsSubmitting]);

  React.useEffect(() => {
    setIsGeneratingCodes(externalIsGeneratingCodes);
  }, [externalIsGeneratingCodes]);

  const value = {
    isSubmitting,
    isGeneratingCodes,
    initialValues,
    setIsSubmitting,
    setIsGeneratingCodes,
  };

  return (
    <DealFormContext.Provider value={value}>
      {children}
    </DealFormContext.Provider>
  );
};

// Export with both names for backward compatibility and to fix the current errors
export const useDealForm = (): DealFormContextType => {
  const context = useContext(DealFormContext);
  if (context === undefined) {
    throw new Error('useDealForm must be used within a DealFormProvider');
  }
  return context;
};

// Add this alias to fix the immediate errors
export const useDealFormContext = useDealForm;
