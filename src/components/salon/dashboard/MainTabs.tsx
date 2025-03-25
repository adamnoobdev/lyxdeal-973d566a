
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DealsSection } from "@/components/salon/DealsSection";
import { PurchasesTableContainer } from "@/components/salon/PurchasesTableContainer";
import { ProfileSettings } from "@/components/salon/ProfileSettings";
import { ManageSubscription } from "@/components/salon/ManageSubscription";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useSession } from "@/hooks/useSession";

export function MainTabs() {
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

  // Function to update salon data after profile changes
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
    <Tabs defaultValue="deals" className="w-full">
      <TabsList className="grid grid-cols-4 w-full max-w-2xl mb-8">
        <TabsTrigger value="deals">Erbjudanden</TabsTrigger>
        <TabsTrigger value="customers">Köphistorik</TabsTrigger>
        <TabsTrigger value="subscription">Prenumeration</TabsTrigger>
        <TabsTrigger value="profile">Profil</TabsTrigger>
      </TabsList>
      
      <TabsContent value="deals" className="space-y-6">
        <DealsSection 
          title="Dina erbjudanden"
          deals={[]} 
          onEdit={() => {}} 
          onDelete={() => {}}
        />
      </TabsContent>
      
      <TabsContent value="customers" className="space-y-6">
        <PurchasesTableContainer />
      </TabsContent>
      
      <TabsContent value="subscription" className="space-y-6">
        <ManageSubscription />
      </TabsContent>
      
      <TabsContent value="profile" className="space-y-6">
        {!isLoading && salonData && (
          <ProfileSettings 
            salon={salonData} 
            onUpdate={handleProfileUpdate} 
          />
        )}
      </TabsContent>
    </Tabs>
  );
}
