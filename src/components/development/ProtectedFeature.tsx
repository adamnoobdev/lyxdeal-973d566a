
import React from 'react';
import { useFeatureFlag } from '@/hooks/useFeatureFlag';

interface ProtectedFeatureProps {
  flagName: string;
  fallback?: React.ReactNode;
  children: React.ReactNode;
  userIsAdmin?: boolean;
}

/**
 * Komponent som visar innehållet endast om en feature flag är aktiverad
 */
export const ProtectedFeature: React.FC<ProtectedFeatureProps> = ({
  flagName,
  fallback = null,
  children,
  userIsAdmin = false
}) => {
  const isEnabled = useFeatureFlag(flagName, userIsAdmin);
  
  if (!isEnabled) {
    return <>{fallback}</>;
  }
  
  return <>{children}</>;
};
