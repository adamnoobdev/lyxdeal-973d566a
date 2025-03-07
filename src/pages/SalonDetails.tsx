
import { useState } from "react";
import { useParams } from "react-router-dom";
import { DealStatistics } from "@/components/salon/DealStatistics";
import { CustomersTable } from "@/components/salon/CustomersTable";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { SalonDeals } from "@/components/admin/salons/SalonDeals";

export default function SalonDetails() {
  const { dealId } = useParams();
  const [activeTab, setActiveTab] = useState("overview");
  
  return (
    <div className="container mx-auto p-6 space-y-8">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold">Erbjudandedetaljer</h1>
        <p className="text-muted-foreground">
          Statistik och kunddata för det valda erbjudandet
        </p>
      </div>
      
      <div className="space-y-6">
        <DealStatistics dealId={dealId} />
        
        <Tabs 
          defaultValue="customers" 
          value={activeTab}
          onValueChange={setActiveTab}
          className="space-y-4"
        >
          <TabsList className="bg-secondary/10 border border-secondary/30">
            <TabsTrigger value="customers">Kunder</TabsTrigger>
            <TabsTrigger value="details">Erbjudandedetaljer</TabsTrigger>
          </TabsList>
          
          <TabsContent value="customers" className="space-y-4">
            <CustomersTable />
          </TabsContent>
          
          <TabsContent value="details">
            <SalonDeals />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
