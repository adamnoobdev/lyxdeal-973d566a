
import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useSession } from '@/hooks/useSession';
import { SalonLayout } from './layout/SalonLayout';
import { ProfileSettings } from './ProfileSettings';
import { ManageSubscription } from './ManageSubscription';
import { Skeleton } from '@/components/ui/skeleton';
import { Separator } from '@/components/ui/separator';

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
      <div className="max-w-3xl mx-auto space-y-6 pb-6">
        <div className="border-b pb-3">
          <h1 className="text-xl sm:text-2xl font-bold text-primary">Inställningar</h1>
        </div>
        
        <div className="space-y-8">
          {/* Subscription Section */}
          <section>
            <h2 className="text-lg sm:text-xl font-semibold mb-4">Prenumeration</h2>
            <ManageSubscription />
          </section>
          
          <Separator className="my-5 opacity-50" />
          
          {/* Profile Section */}
          <section>
            {isLoading ? (
              <div className="space-y-3">
                <Skeleton className="h-6 w-56" />
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-48 w-full rounded-md mt-4" />
              </div>
            ) : salonData ? (
              <ProfileSettings 
                salon={salonData} 
                onUpdate={handleProfileUpdate} 
              />
            ) : (
              <div className="p-4 bg-muted/50 rounded-md text-center">
                <p className="text-muted-foreground">Kunde inte ladda salongsdata.</p>
              </div>
            )}
          </section>
        </div>
      </div>
    </SalonLayout>
  );
};
