import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Scissors, Users } from "lucide-react";
import { Card } from "@/components/ui/card";
import { DealsList } from "@/components/admin/DealsList";
import { SalonsList } from "@/components/admin/salons/SalonsList";

interface DashboardTabsProps {
  isAdmin: boolean;
}

export const DashboardTabs = ({ isAdmin }: DashboardTabsProps) => {
  return (
    <Tabs defaultValue="deals" className="space-y-4">
      <TabsList>
        <TabsTrigger value="deals">
          <Scissors className="mr-2 h-4 w-4" />
          Erbjudanden
        </TabsTrigger>
        {isAdmin && (
          <TabsTrigger value="salons">
            <Users className="mr-2 h-4 w-4" />
            Salonger
          </TabsTrigger>
        )}
      </TabsList>

      <TabsContent value="deals">
        <Card className="p-6">
          <DealsList />
        </Card>
      </TabsContent>

      {isAdmin && (
        <TabsContent value="salons">
          <Card className="p-6">
            <SalonsList />
          </Card>
        </TabsContent>
      )}
    </Tabs>
  );
};