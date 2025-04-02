
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
      <div className="max-w-4xl mx-auto space-y-8 pb-8">
        <div className="border-b pb-4">
          <h1 className="text-3xl font-bold text-primary">Inställningar</h1>
        </div>
        
        <div className="space-y-12">
          {/* Subscription Section */}
          <section>
            <h2 className="text-2xl font-semibold mb-6">Prenumeration</h2>
            <ManageSubscription />
          </section>
          
          <Separator className="my-6 opacity-50" />
          
          {/* Profile Section */}
          <section>
            {isLoading ? (
              <div className="space-y-4">
                <Skeleton className="h-8 w-64" />
                <Skeleton className="h-4 w-40" />
                <Skeleton className="h-64 w-full rounded-md mt-6" />
              </div>
            ) : salonData ? (
              <ProfileSettings 
                salon={salonData} 
                onUpdate={handleProfileUpdate} 
              />
            ) : (
              <div className="p-6 bg-muted/50 rounded-md text-center">
                <p className="text-muted-foreground">Kunde inte ladda salongsdata.</p>
              </div>
            )}
          </section>
        </div>
      </div>
    </SalonLayout>
  );
};
