
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

// Original dealTypes.ts content should be moved here
// We can remove the re-export that was causing the error
// export * from './dealTypes';
