
/**
 * Type definitions for deal operations
 */

import { Database } from "@/integrations/supabase/types";

// Deal information from database
export type Deal = Database['public']['Tables']['deals']['Row'];

// Deal status types
export type DealStatus = 'pending' | 'approved' | 'rejected';

// Deal with possible salon information
export interface DealWithSalon extends Deal {
  salons?: {
    name: string;
    id?: number;
  } | null;
}

// For consistent imports, re-export dealTypes
export * from './dealTypes';
