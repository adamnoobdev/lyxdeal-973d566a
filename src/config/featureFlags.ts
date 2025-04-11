
/**
 * Feature flags för att aktivera/avaktivera funktioner
 * 
 * UTVECKLINGSGUIDE:
 * - Sätt värdet till `true` för att aktivera en funktion
 * - Sätt värdet till `false` för att avaktivera en funktion
 * - För admin-only funktioner, använd isAdminOnly: true
 * 
 * Använd tillsammans med useFeatureFlag-hooken för att visa/dölja komponenter
 */

export interface FeatureFlag {
  enabled: boolean;
  isAdminOnly?: boolean;
  description: string;
}

export interface FeatureFlags {
  [key: string]: FeatureFlag;
}

// Centraliserad konfiguration för alla feature flags
const featureFlags: FeatureFlags = {
  // Exempel på funktioner (lägg till dina egna här)
  NEW_DISCOUNT_SYSTEM: {
    enabled: false,
    description: "Nytt system för rabattkoder med förbättrad validering"
  },
  ADVANCED_ANALYTICS: {
    enabled: false,
    isAdminOnly: true,
    description: "Avancerad analys av användarbeteende och konvertering"
  },
  DIRECT_BOOKING: {
    enabled: true,
    description: "Möjlighet att boka direkt utan att behöva gå via rabattkod"
  },
  
  // Lägg till fler feature flags här när du implementerar nya funktioner
};

export default featureFlags;
