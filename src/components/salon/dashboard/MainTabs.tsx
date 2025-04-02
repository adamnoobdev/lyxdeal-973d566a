
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DealsSection } from "@/components/salon/DealsSection";
import { PurchasesTableContainer } from "@/components/salon/PurchasesTableContainer";
import { ProfileSettings } from "@/components/salon/ProfileSettings";
import { ManageSubscription } from "@/components/salon/ManageSubscription";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useSession } from "@/hooks/useSession";
import { useSalonDeals } from "@/hooks/salon-deals";
import { Deal } from "@/types/deal";
import { useIsMobile } from "@/hooks/use-mobile";
import { Card, CardContent } from "@/components/ui/card";

export function MainTabs() {
  const { session } = useSession();
  const [salonData, setSalonData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const isMobile = useIsMobile();

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

  const salonId = salonData?.id;
  
  const emptyDeals: Deal[] = [];

  return (
    <Card className="border shadow-sm overflow-hidden">
      <CardContent className="p-0">
        <Tabs defaultValue="deals" className="w-full">
          <TabsList className={`grid ${isMobile ? 'grid-cols-2' : 'grid-cols-4'} w-full mb-0 rounded-none border-b`}>
            <TabsTrigger value="deals" className="rounded-none data-[state=active]:bg-primary/5">Erbjudanden</TabsTrigger>
            <TabsTrigger value="customers" className="rounded-none data-[state=active]:bg-primary/5">Rabattkoder</TabsTrigger>
            {!isMobile && (
              <>
                <TabsTrigger value="subscription" className="rounded-none data-[state=active]:bg-primary/5">Prenumeration</TabsTrigger>
                <TabsTrigger value="profile" className="rounded-none data-[state=active]:bg-primary/5">Profil</TabsTrigger>
              </>
            )}
            {isMobile && (
              <TabsTrigger value="more" className="rounded-none data-[state=active]:bg-primary/5">Mer</TabsTrigger>
            )}
          </TabsList>
          
          <div className="p-4 sm:p-6">
            <TabsContent value="deals" className="space-y-4 sm:space-y-6 mt-0">
              <DealsSection 
                title="Dina erbjudanden"
                deals={emptyDeals} 
                onEdit={() => {}} 
                onDelete={() => {}}
              />
            </TabsContent>
            
            <TabsContent value="customers" className="space-y-4 sm:space-y-6 mt-0">
              <PurchasesTableContainer />
            </TabsContent>
            
            <TabsContent value="subscription" className="space-y-4 sm:space-y-6 mt-0">
              <ManageSubscription />
            </TabsContent>
            
            <TabsContent value="profile" className="space-y-4 sm:space-y-6 mt-0">
              {!isLoading && salonData && (
                <ProfileSettings 
                  salon={salonData} 
                  onUpdate={handleProfileUpdate} 
                />
              )}
            </TabsContent>
            
            {isMobile && (
              <TabsContent value="more" className="space-y-4 sm:space-y-6 mt-0">
                <Tabs defaultValue="subscription" className="w-full">
                  <TabsList className="grid grid-cols-2 w-full mb-4">
                    <TabsTrigger value="subscription">Prenumeration</TabsTrigger>
                    <TabsTrigger value="profile">Profil</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="subscription" className="space-y-4 sm:space-y-6 mt-0">
                    <ManageSubscription />
                  </TabsContent>
                  
                  <TabsContent value="profile" className="space-y-4 sm:space-y-6 mt-0">
                    {!isLoading && salonData && (
                      <ProfileSettings 
                        salon={salonData} 
                        onUpdate={handleProfileUpdate} 
                      />
                    )}
                  </TabsContent>
                </Tabs>
              </TabsContent>
            )}
          </div>
        </Tabs>
      </CardContent>
    </Card>
  );
}
