
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { DealsSection } from "@/components/salon/DealsSection";
import { PurchasesTableContainer } from "@/components/salon/PurchasesTableContainer";
import { ProfileSettings } from "@/components/salon/ProfileSettings";
import { ManageSubscription } from "@/components/salon/ManageSubscription";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useSession } from "@/hooks/useSession";
import { useSalonDeals } from "@/hooks/salon-deals";
import { Deal } from "@/types/deal";
import { SubscriptionInactiveAlert } from "./SubscriptionInactiveAlert";
import { ReactivateSubscriptionDialog } from "./ReactivateSubscriptionDialog";
import { SalonCollaborationsContent } from "./collaborations/SalonCollaborationsContent";

export function MainTabs() {
  const { session } = useSession();
  const [salonData, setSalonData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showReactivateDialog, setShowReactivateDialog] = useState(false);

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

  const handleReactivationSuccess = async () => {
    if (!session?.user?.id) return;
    
    // Uppdatera salongsdata efter lyckad återaktivering
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
  const isSubscriptionActive = salonData?.status === "active";
  const hasSubscription = !!salonData?.stripe_subscription_id;
  
  const emptyDeals: Deal[] = [];

  return (
    <>
      {salonData && hasSubscription && !isSubscriptionActive && (
        <SubscriptionInactiveAlert 
          onReactivate={() => setShowReactivateDialog(true)} 
        />
      )}
      
      <Tabs defaultValue="deals" className="w-full">
        <TabsList className="grid grid-cols-5 w-full max-w-3xl mb-8">
          <TabsTrigger value="deals">Erbjudanden</TabsTrigger>
          <TabsTrigger value="collaborations">Samarbeten</TabsTrigger>
          <TabsTrigger value="customers">Rabattkoder</TabsTrigger>
          <TabsTrigger value="subscription">Prenumeration</TabsTrigger>
          <TabsTrigger value="profile">Profil</TabsTrigger>
        </TabsList>
        
        <TabsContent value="deals" className="space-y-6">
          {isSubscriptionActive ? (
            <DealsSection 
              title="Dina erbjudanden"
              deals={emptyDeals} 
              onEdit={() => {}} 
              onDelete={() => {}}
            />
          ) : (
            <div className="rounded-lg border p-6 text-center">
              <h3 className="text-lg font-medium mb-2">Inaktiv prenumeration</h3>
              <p className="text-muted-foreground mb-4">
                Din prenumeration är inaktiv. Återaktivera för att kunna hantera erbjudanden.
              </p>
              <Button 
                onClick={() => setShowReactivateDialog(true)}
                variant="default"
              >
                Återaktivera prenumeration
              </Button>
            </div>
          )}
        </TabsContent>

        <TabsContent value="collaborations" className="space-y-6">
          {isSubscriptionActive ? (
            <SalonCollaborationsContent salonId={salonId} />
          ) : (
            <div className="rounded-lg border p-6 text-center">
              <h3 className="text-lg font-medium mb-2">Inaktiv prenumeration</h3>
              <p className="text-muted-foreground mb-4">
                Din prenumeration är inaktiv. Återaktivera för att kunna hantera samarbeten med kreatörer.
              </p>
              <Button 
                onClick={() => setShowReactivateDialog(true)}
                variant="default"
              >
                Återaktivera prenumeration
              </Button>
            </div>
          )}
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

      {showReactivateDialog && (
        <ReactivateSubscriptionDialog
          isOpen={showReactivateDialog}
          onClose={() => setShowReactivateDialog(false)}
          subscriptionId={salonData?.stripe_subscription_id}
          onSuccess={handleReactivationSuccess}
        />
      )}
    </>
  );
}
