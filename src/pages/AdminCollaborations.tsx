
import { useState, useEffect } from 'react';
import { AdminLayout } from '@/components/admin/layout/AdminLayout';
import { AdminAuthCheck } from '@/components/admin/auth/AdminAuthCheck';
import { CollaborationsList } from '@/components/admin/collaborations/CollaborationsList';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CollaborationApplications } from '@/components/admin/collaborations/CollaborationApplications';
import { ActiveCollaborations } from '@/components/admin/collaborations/ActiveCollaborations';

const AdminCollaborations = () => {
  const [activeTab, setActiveTab] = useState("requests");

  // Debugging information to help track component lifecycle and state
  useEffect(() => {
    console.log('AdminCollaborations component rendered');
    console.log('Current active tab:', activeTab);
  }, [activeTab]);

  return (
    <AdminAuthCheck>
      <AdminLayout>
        <div className="container mx-auto p-4 max-w-7xl">
          <h1 className="text-2xl font-bold mb-6">Kreatörssamarbeten</h1>
          
          <Tabs defaultValue="requests" value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="mb-6 w-full max-w-md mx-auto flex justify-between overflow-x-auto">
              <TabsTrigger value="requests" className="flex-1">Förfrågningar</TabsTrigger>
              <TabsTrigger value="applications" className="flex-1">Ansökningar</TabsTrigger>
              <TabsTrigger value="active" className="flex-1">Aktiva</TabsTrigger>
            </TabsList>
            
            <div className="mb-4 text-sm text-muted-foreground">
              <p>Aktuell flik: {activeTab === "requests" ? "Förfrågningar" : activeTab === "applications" ? "Ansökningar" : "Aktiva"}</p>
            </div>
            
            <TabsContent value="requests" className="space-y-4 animate-fade-in">
              <CollaborationsList />
            </TabsContent>
            
            <TabsContent value="applications" className="space-y-4 animate-fade-in">
              <CollaborationApplications />
            </TabsContent>
            
            <TabsContent value="active" className="space-y-4 animate-fade-in">
              <ActiveCollaborations />
            </TabsContent>
          </Tabs>
        </div>
      </AdminLayout>
    </AdminAuthCheck>
  );
};

export default AdminCollaborations;
