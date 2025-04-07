
import React, { createContext, useContext, useState, ReactNode } from 'react';
import { FormValues } from './schema';

interface DealFormContextType {
  isSubmitting: boolean;
  initialValues?: FormValues;
  setIsSubmitting: (isSubmitting: boolean) => void;
}

const DealFormContext = createContext<DealFormContextType | undefined>(undefined);

interface DealFormProviderProps {
  children: ReactNode;
  initialValues?: FormValues;
  externalIsSubmitting?: boolean;
}

export const DealFormProvider: React.FC<DealFormProviderProps> = ({
  children,
  initialValues,
  externalIsSubmitting = false,
}) => {
  const [isSubmitting, setIsSubmitting] = useState(externalIsSubmitting);
  
  // Update internal state when external state changes
  React.useEffect(() => {
    setIsSubmitting(externalIsSubmitting);
  }, [externalIsSubmitting]);

  const value = {
    isSubmitting,
    initialValues,
    setIsSubmitting,
  };

  return (
    <DealFormContext.Provider value={value}>
      {children}
    </DealFormContext.Provider>
  );
};

export const useDealForm = (): DealFormContextType => {
  const context = useContext(DealFormContext);
  if (context === undefined) {
    throw new Error('useDealForm must be used within a DealFormProvider');
  }
  return context;
};
