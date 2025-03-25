
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DealsSection } from "@/components/salon/DealsSection";
import { PurchasesTableContainer } from "@/components/salon/PurchasesTableContainer";
import { ProfileSettings } from "@/components/salon/ProfileSettings";
import { ManageSubscription } from "@/components/salon/ManageSubscription";

export function MainTabs() {
  return (
    <Tabs defaultValue="deals" className="w-full">
      <TabsList className="grid grid-cols-4 w-full max-w-2xl mb-8">
        <TabsTrigger value="deals">Erbjudanden</TabsTrigger>
        <TabsTrigger value="customers">Köphistorik</TabsTrigger>
        <TabsTrigger value="subscription">Prenumeration</TabsTrigger>
        <TabsTrigger value="profile">Profil</TabsTrigger>
      </TabsList>
      
      <TabsContent value="deals" className="space-y-6">
        <DealsSection />
      </TabsContent>
      
      <TabsContent value="customers" className="space-y-6">
        <PurchasesTableContainer />
      </TabsContent>
      
      <TabsContent value="subscription" className="space-y-6">
        <ManageSubscription />
      </TabsContent>
      
      <TabsContent value="profile" className="space-y-6">
        <ProfileSettings />
      </TabsContent>
    </Tabs>
  );
}
