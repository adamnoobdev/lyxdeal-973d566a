
import { useState, useEffect } from "react";
import { useParams, Navigate } from "react-router-dom";
import { DealStatistics } from "@/components/salon/DealStatistics";
import { CustomersTable } from "@/components/salon/CustomersTable";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { SalonDeals } from "@/components/admin/salons/SalonDeals";

export default function SalonDetails() {
  const { id } = useParams();
  const [activeTab, setActiveTab] = useState("overview");
  
  useEffect(() => {
    console.log("SalonDetails rendering with ID:", id);
  }, [id]);
  
  if (!id) {
    console.error("No salon ID provided");
    return <Navigate to="/admin" replace />;
  }

  return (
    <div className="container mx-auto p-6 space-y-8">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold">Salongsdetaljer</h1>
        <p className="text-muted-foreground">
          Statistik och kunddata för salong #{id}
        </p>
      </div>
      
      <div className="space-y-6">
        <DealStatistics dealId={id} />
        
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
