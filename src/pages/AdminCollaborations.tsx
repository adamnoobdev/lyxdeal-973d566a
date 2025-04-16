
import { useState } from 'react';
import { AdminLayout } from '@/components/admin/layout/AdminLayout';
import { AdminAuthCheck } from '@/components/admin/auth/AdminAuthCheck';
import { CollaborationsList } from '@/components/admin/collaborations/CollaborationsList';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CollaborationApplications } from '@/components/admin/collaborations/CollaborationApplications';
import { ActiveCollaborations } from '@/components/admin/collaborations/ActiveCollaborations';

const AdminCollaborations = () => {
  const [activeTab, setActiveTab] = useState("requests");

  return (
    <AdminAuthCheck>
      <AdminLayout>
        <div className="container mx-auto px-4 py-8">
          <h1 className="text-2xl font-bold mb-6">Kreatörssamarbeten</h1>
          
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="mb-6">
              <TabsTrigger value="requests">Förfrågningar</TabsTrigger>
              <TabsTrigger value="applications">Ansökningar</TabsTrigger>
              <TabsTrigger value="active">Aktiva Samarbeten</TabsTrigger>
            </TabsList>
            
            <TabsContent value="requests" className="space-y-4">
              <CollaborationsList />
            </TabsContent>
            
            <TabsContent value="applications" className="space-y-4">
              <CollaborationApplications />
            </TabsContent>
            
            <TabsContent value="active" className="space-y-4">
              <ActiveCollaborations />
            </TabsContent>
          </Tabs>
        </div>
      </AdminLayout>
    </AdminAuthCheck>
  );
};

export default AdminCollaborations;
