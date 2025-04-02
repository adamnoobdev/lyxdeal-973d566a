
import { useEffect, useState } from 'react';
import { useSession } from './useSession';
import { supabase } from '@/integrations/supabase/client';

export type UserRole = 'customer' | 'salon_owner' | 'admin' | null;

export const useUserRole = () => {
  const { session } = useSession();
  const [userRole, setUserRole] = useState<UserRole>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchUserRole = async () => {
      if (!session?.user?.id) {
        setUserRole(null);
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        
        // Check if user is a salon owner with admin role
        const { data: salonData, error: salonError } = await supabase
          .from('salons')
          .select('role')
          .eq('user_id', session.user.id)
          .single();
          
        if (salonError && salonError.code !== 'PGRST116') { // Ignore not found errors
          throw salonError;
        }
        
        if (salonData && salonData.role === 'admin') {
          setUserRole('admin');
          setIsLoading(false);
          return;
        }
          
        // If found, but not admin
        if (salonData) {
          setUserRole('salon_owner');
        } else {
          // If no salon data found, user is a customer
          setUserRole('customer');
        }
          
      } catch (err) {
        console.error('Error fetching user role:', err);
        setError(err instanceof Error ? err : new Error('Unknown error fetching user role'));
        setUserRole(null);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserRole();
  }, [session]);

  return { userRole, isLoading, error };
};
