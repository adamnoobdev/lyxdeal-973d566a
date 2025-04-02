
// This file is being kept for backward compatibility
// It re-exports the refactored useSalonDeals hook from the salon-deals directory

import { useSalonDeals as UseSalonDealsHook } from './salon-deals';
import { UseSalonDealsResult } from './salon-deals/types';

export const useSalonDeals = UseSalonDealsHook;

export type { UseSalonDealsResult };
