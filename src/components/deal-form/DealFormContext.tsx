
import React, { createContext, useContext, useState, useEffect } from 'react';
import { FormValues } from './schema';

interface DealFormContextType {
  isSubmitting: boolean;
  setIsSubmitting: (isSubmitting: boolean) => void;
  isGeneratingCodes: boolean;
  setIsGeneratingCodes: (isGeneratingCodes: boolean) => void;
  initialValues?: FormValues;
}

const DealFormContext = createContext<DealFormContextType | undefined>(undefined);

export const useDealFormContext = (): DealFormContextType => {
  const context = useContext(DealFormContext);
  if (!context) {
    throw new Error('useDealFormContext must be used within a DealFormProvider');
  }
  return context;
};

interface DealFormProviderProps {
  children: React.ReactNode;
  initialValues?: FormValues;
  externalIsSubmitting?: boolean;
}

export const DealFormProvider: React.FC<DealFormProviderProps> = ({
  children,
  initialValues,
  externalIsSubmitting = false,
}) => {
  const [isSubmitting, setIsSubmitting] = useState(externalIsSubmitting);
  const [isGeneratingCodes, setIsGeneratingCodes] = useState(false);

  // If externalIsSubmitting changes, update internal state
  useEffect(() => {
    console.log('DealFormProvider: externalIsSubmitting changed to', externalIsSubmitting);
    setIsSubmitting(externalIsSubmitting);
  }, [externalIsSubmitting]);

  return (
    <DealFormContext.Provider
      value={{
        isSubmitting,
        setIsSubmitting,
        isGeneratingCodes,
        setIsGeneratingCodes,
        initialValues,
      }}
    >
      {children}
    </DealFormContext.Provider>
  );
};
