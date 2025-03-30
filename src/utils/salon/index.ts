
// Central export fil för all salongrelaterad funktionalitet
export * from './queries';
export * from './salonDataUtils';
export * from './salonSearchUtils';
export * from './types';

// För att göra bakåtkompatibilitet enklare
import { checkSalonsTable, fetchSalonByExactId, fetchFullSalonData } from './queries';
import { findSalonWithSimilarId } from './salonSearchUtils';
import { SalonData, createDefaultSalonData } from './types';

// Re-export i gammal stil för att stödja existerande kod
export { 
  checkSalonsTable, 
  fetchSalonByExactId, 
  fetchFullSalonData,
  findSalonWithSimilarId,
  createDefaultSalonData
};
export type { SalonData };
