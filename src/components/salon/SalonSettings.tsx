
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
      <div className="space-y-10">
        <div className="border-b pb-5">
          <h1 className="text-3xl font-bold text-primary">Inställningar</h1>
        </div>
        
        <div className="space-y-10">
          {/* Subscription Section */}
          <section>
            <h2 className="text-2xl font-semibold mb-6">Prenumeration</h2>
            <ManageSubscription />
          </section>
          
          {/* Profile Section */}
          <section>
            {isLoading ? (
              <div className="space-y-4">
                <Skeleton className="h-8 w-3/4" />
                <Skeleton className="h-32 w-full rounded-md" />
              </div>
            ) : salonData ? (
              <ProfileSettings 
                salon={salonData} 
                onUpdate={handleProfileUpdate} 
              />
            ) : (
              <p className="text-muted-foreground">Kunde inte ladda salongsdata.</p>
            )}
          </section>
        </div>
      </div>
    </SalonLayout>
  );
};
