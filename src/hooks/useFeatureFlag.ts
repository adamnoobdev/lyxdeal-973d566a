
import { useCallback, useEffect, useState } from 'react';
import featureFlags, { FeatureFlag } from '@/config/featureFlags';
import { useEnvironmentDetection } from './auth/useEnvironmentDetection';

/**
 * Hook för att kontrollera om en feature flag är aktiverad
 * 
 * @param flagName Namnet på feature-flaggan
 * @param userIsAdmin Om användaren är admin (för admin-specifika flaggor)
 * @returns Boolean som indikerar om funktionen är aktiverad
 */
export const useFeatureFlag = (
  flagName: string,
  userIsAdmin: boolean = false
): boolean => {
  const { isSandboxEnvironment } = useEnvironmentDetection();
  const [isEnabled, setIsEnabled] = useState<boolean>(false);
  
  const checkFlag = useCallback(() => {
    const flag = featureFlags[flagName];
    
    if (!flag) {
      console.warn(`Feature flag '${flagName}' är inte definierad. Returnerar false.`);
      return false;
    }
    
    // Kontrollera om det är en admin-only funktion
    if (flag.isAdminOnly && !userIsAdmin) {
      return false;
    }
    
    // I sandbox-miljö (lokal utveckling eller lovable) kan vi aktivera flaggor via localStorage
    if (isSandboxEnvironment()) {
      const localOverride = localStorage.getItem(`feature_${flagName}`);
      if (localOverride !== null) {
        return localOverride === 'true';
      }
    }
    
    return flag.enabled;
  }, [flagName, userIsAdmin, isSandboxEnvironment]);
  
  useEffect(() => {
    setIsEnabled(checkFlag());
  }, [checkFlag]);
  
  return isEnabled;
};

/**
 * Hook för att hämta alla tillgängliga feature flags
 * 
 * @param userIsAdmin Om användaren är admin (för admin-specifika flaggor)
 * @returns Object med alla feature flags och deras status
 */
export const useFeatureFlags = (userIsAdmin: boolean = false) => {
  const [flags, setFlags] = useState<Record<string, boolean>>({});
  const { isSandboxEnvironment } = useEnvironmentDetection();
  
  useEffect(() => {
    const enabledFlags: Record<string, boolean> = {};
    
    // Gå igenom alla definierade flaggor
    Object.entries(featureFlags).forEach(([key, flag]) => {
      // Skippa admin-only flaggor för icke-admin användare
      if (flag.isAdminOnly && !userIsAdmin) {
        enabledFlags[key] = false;
        return;
      }
      
      // Kontrollera lokala överrides i utvecklingsmiljön
      if (isSandboxEnvironment()) {
        const localOverride = localStorage.getItem(`feature_${key}`);
        if (localOverride !== null) {
          enabledFlags[key] = localOverride === 'true';
          return;
        }
      }
      
      // Använd default-värde från konfigurationen
      enabledFlags[key] = flag.enabled;
    });
    
    setFlags(enabledFlags);
  }, [userIsAdmin, isSandboxEnvironment]);
  
  // Funktion för att aktivera/avaktivera en feature flag i utvecklingsmiljön
  const toggleFeatureFlag = useCallback((flagName: string) => {
    if (!isSandboxEnvironment()) {
      console.warn('Feature flags kan endast ändras i utvecklingsmiljö');
      return;
    }
    
    if (!featureFlags[flagName]) {
      console.error(`Feature flag '${flagName}' finns inte`);
      return;
    }
    
    const currentValue = localStorage.getItem(`feature_${flagName}`);
    const newValue = currentValue === 'true' ? 'false' : 'true';
    
    localStorage.setItem(`feature_${flagName}`, newValue);
    
    // Uppdatera state
    setFlags(prev => ({
      ...prev,
      [flagName]: newValue === 'true'
    }));
    
    // Tvinga omrendering av sidan för att visa ändringarna
    window.location.reload();
  }, [isSandboxEnvironment]);
  
  return { flags, toggleFeatureFlag };
};
