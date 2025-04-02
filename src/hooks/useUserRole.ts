
import { useState, useEffect } from 'react';
import { useSession } from './useSession';
import { supabase } from '@/integrations/supabase/client';

type UserRole = 'admin' | 'salon_owner' | 'user' | null;

export const useUserRole = () => {
  const { session } = useSession();
  const [userRole, setUserRole] = useState<UserRole>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchUserRole = async () => {
      if (!session?.user?.id) {
        setUserRole(null);
        setIsLoading(false);
        return;
      }

      try {
        const { data, error } = await supabase
          .from('salons')
          .select('role')
          .eq('user_id', session.user.id)
          .single();

        if (error) {
          console.error('Error fetching user role:', error);
          setUserRole(null);
        } else {
          setUserRole(data?.role as UserRole || null);
        }
      } catch (error) {
        console.error('Error fetching user role:', error);
        setUserRole(null);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserRole();
  }, [session?.user?.id]);

  return { userRole, isLoading };
};
