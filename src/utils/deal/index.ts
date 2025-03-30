
// Central export-fil för all deal-relaterad funktionalitet
export * from './queries';
export * from './types';
export * from './dealFormatUtils';
export * from './dealPriceUtils';
export * from './dealTimeUtils';

// För bakåtkompatibilitet, re-exportera från queries
import { createDeal, updateDeal, deleteDeal, toggleDealActive } from './queries';
export {
  createDeal,
  updateDeal,
  deleteDeal,
  toggleDealActive
};
