
import React, { createContext, useContext, useState } from 'react';

interface SeoContextType {
  setPageTitle: (title: string) => void;
  setPageDescription: (description: string) => void;
  pageTitle: string;
  pageDescription: string;
}

const SeoContext = createContext<SeoContextType | undefined>(undefined);

export const SeoProvider: React.FC<{children: React.ReactNode}> = ({ children }) => {
  const [pageTitle, setPageTitle] = useState('Lyxdeal | Skönhetserbjudanden');
  const [pageDescription, setPageDescription] = useState(
    'Upptäck de bästa skönhetserbjudandena i din stad. Lyxdeal erbjuder fantastiska priser på högkvalitativa skönhetsbehandlingar.'
  );

  const value = {
    pageTitle,
    pageDescription,
    setPageTitle,
    setPageDescription
  };

  return <SeoContext.Provider value={value}>{children}</SeoContext.Provider>;
};

export const useSeo = (): SeoContextType => {
  const context = useContext(SeoContext);
  if (context === undefined) {
    throw new Error('useSeo must be used within a SeoProvider');
  }
  return context;
};
