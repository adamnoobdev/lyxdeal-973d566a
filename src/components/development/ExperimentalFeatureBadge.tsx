
import React from 'react';
import { useFeatureFlag } from '@/hooks/useFeatureFlag';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useEnvironmentDetection } from '@/hooks/auth/useEnvironmentDetection';

interface ExperimentalFeatureBadgeProps {
  flagName: string;
  message?: string;
}

export const ExperimentalFeatureBadge: React.FC<ExperimentalFeatureBadgeProps> = ({
  flagName,
  message
}) => {
  const isEnabled = useFeatureFlag(flagName);
  const { isSandboxEnvironment } = useEnvironmentDetection();
  
  // Visa endast i utvecklingsmiljö och om funktionen är aktiverad
  if (!isSandboxEnvironment() || !isEnabled) {
    return null;
  }
  
  return (
    <Alert className="bg-yellow-50 border-yellow-200 text-yellow-800 mb-4">
      <AlertDescription>
        <span className="flex items-center gap-2">
          <span className="bg-yellow-200 text-yellow-800 px-2 py-0.5 rounded text-xs font-medium">
            EXPERIMENTELL
          </span> 
          {message || `Denna funktion (${flagName}) är under utveckling och är inte tillgänglig i produktionsmiljön.`}
        </span>
      </AlertDescription>
    </Alert>
  );
};
