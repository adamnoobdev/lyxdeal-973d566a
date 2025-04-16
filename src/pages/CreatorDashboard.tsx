
import { useEffect, useState } from 'react';
import { Helmet } from "react-helmet";
import { useAuth } from "@/hooks/useAuth";
import { useNavigate } from "react-router-dom";
import { CreatorLayout } from "@/components/creator/dashboard/CreatorLayout";
import { CreatorOpportunities } from "@/components/creator/dashboard/CreatorOpportunities";
import { CreatorActiveCollaborations } from "@/components/creator/dashboard/CreatorActiveCollaborations";
import { CreatorApplications } from "@/components/creator/dashboard/CreatorApplications";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { Lightbulb } from "lucide-react";

const CreatorDashboard = () => {
  const { user, profile, loading } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("opportunities");

  useEffect(() => {
    // Redirect non-creators to creator page
    if (!loading && (!user || !profile || profile.role !== 'creator')) {
      navigate('/creator');
    }
  }, [user, profile, loading, navigate]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-pulse">Laddar...</div>
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>Kreatörportal | Lyxdeal</title>
        <meta name="description" content="Hantera dina samarbeten som kreatör på Lyxdeal" />
      </Helmet>
      
      <CreatorLayout>
        <div className="container mx-auto p-4 max-w-7xl">
          <h1 className="text-2xl font-bold mb-6">Kreatörportal</h1>
          
          <Alert className="mb-6 bg-purple-50 border-purple-200">
            <Lightbulb className="h-4 w-4 text-purple-500" />
            <AlertTitle className="text-purple-700">Välkommen till din kreatörportal</AlertTitle>
            <AlertDescription className="text-purple-600">
              Här kan du hitta och ansöka om samarbeten med salonger samt hantera dina aktiva samarbeten.
            </AlertDescription>
          </Alert>
          
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="mb-6 w-full max-w-md mx-auto flex justify-between overflow-x-auto">
              <TabsTrigger value="opportunities" className="flex-1">Möjligheter</TabsTrigger>
              <TabsTrigger value="applications" className="flex-1">Mina ansökningar</TabsTrigger>
              <TabsTrigger value="active" className="flex-1">Aktiva samarbeten</TabsTrigger>
            </TabsList>
            
            <TabsContent value="opportunities" className="space-y-4 animate-fade-in">
              <CreatorOpportunities />
            </TabsContent>
            
            <TabsContent value="applications" className="space-y-4 animate-fade-in">
              <CreatorApplications />
            </TabsContent>
            
            <TabsContent value="active" className="space-y-4 animate-fade-in">
              <CreatorActiveCollaborations />
            </TabsContent>
          </Tabs>
        </div>
      </CreatorLayout>
    </>
  );
};

export default CreatorDashboard;
