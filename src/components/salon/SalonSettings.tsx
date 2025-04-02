
import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useSession } from '@/hooks/useSession';
import { SalonLayout } from './layout/SalonLayout';
import { ProfileSettings } from './ProfileSettings';
import { ManageSubscription } from './ManageSubscription';
import { Skeleton } from '@/components/ui/skeleton';

export const SalonSettings = () => {
  const { session } = useSession();
  const [salonData, setSalonData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchSalonData = async () => {
      if (!session?.user?.id) return;
      
      try {
        const { data, error } = await supabase
          .from('salons')
          .select('*')
          .eq('user_id', session.user.id)
          .single();
        
        if (error) throw error;
        setSalonData(data);
      } catch (err) {
        console.error("Error fetching salon data:", err);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchSalonData();
  }, [session?.user?.id]);

  const handleProfileUpdate = async () => {
    if (!session?.user?.id) return;
    
    const { data, error } = await supabase
      .from('salons')
      .select('*')
      .eq('user_id', session.user.id)
      .single();
    
    if (!error && data) {
      setSalonData(data);
    }
  };

  return (
    <SalonLayout>
      <div className="space-y-8">
        <h1 className="text-2xl sm:text-3xl font-bold">Inställningar</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Subscription Section */}
          <div className="space-y-4">
            <h2 className="text-xl font-semibold">Prenumeration</h2>
            <ManageSubscription />
          </div>
          
          {/* Profile Section */}
          <div className="space-y-4">
            {isLoading ? (
              <div className="space-y-4">
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
                <Skeleton className="h-4 w-2/3" />
                <Skeleton className="h-10 w-full" />
              </div>
            ) : salonData ? (
              <ProfileSettings 
                salon={salonData} 
                onUpdate={handleProfileUpdate} 
              />
            ) : (
              <p>Kunde inte ladda salongsdata.</p>
            )}
          </div>
        </div>
      </div>
    </SalonLayout>
  );
};
