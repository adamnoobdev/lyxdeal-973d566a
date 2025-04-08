
import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useSession } from './useSession';

export interface SalonData {
  id: number;
  name: string;
  subscription_plan: string | null;
  status: string | null;
  user_id: string;
}

export const useSalon = () => {
  const { session } = useSession();
  const userId = session?.user?.id;
  
  const { 
    data: salon,
    isLoading,
    error,
    refetch
  } = useQuery({
    queryKey: ['salon', userId],
    queryFn: async (): Promise<SalonData | null> => {
      if (!userId) return null;
      
      const { data, error } = await supabase
        .from('salons')
        .select('id, name, subscription_plan, status, user_id')
        .eq('user_id', userId)
        .single();
      
      if (error) {
        console.error("Error fetching salon data:", error);
        return null;
      }
      
      return data;
    },
    enabled: !!userId
  });

  return {
    salon,
    isLoading,
    error,
    refetch
  };
};
