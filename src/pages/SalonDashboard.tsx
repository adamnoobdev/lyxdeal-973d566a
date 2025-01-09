import { useEffect, useState } from "react";
import { useNavigate, Routes, Route } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { LogOut, Settings, Scissors, Users } from "lucide-react";
import { toast } from "sonner";
import { DealsList } from "@/components/admin/DealsList";
import { SalonsList } from "@/components/admin/salons/SalonsList";

interface SalonData {
  id: number;
  name: string;
  email: string;
  phone: string | null;
  address: string | null;
}

export default function SalonDashboard() {
  const navigate = useNavigate();
  const [salonData, setSalonData] = useState<SalonData | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkUser();
    fetchSalonData();
  }, []);

  const checkUser = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      navigate("/salon/login");
      return;
    }

    // Check if user is admin
    const { data: user } = await supabase.auth.getUser();
    if (user?.user?.email === 'admin@example.com') {
      setIsAdmin(true);
    }
  };

  const fetchSalonData = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.user) return;

      const { data: salon, error } = await supabase
        .from("salons")
        .select("*")
        .eq("user_id", session.user.id)
        .single();

      if (error) throw error;
      setSalonData(salon);
    } catch (error) {
      console.error("Error fetching salon data:", error);
      toast.error("Det gick inte att hämta salongens information");
    } finally {
      setLoading(false);
    }
  };

  const handleSignOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      navigate("/salon/login");
    } catch (error) {
      console.error("Error signing out:", error);
      toast.error("Det gick inte att logga ut");
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="container py-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold">{isAdmin ? "Admin Dashboard" : salonData?.name}</h1>
          <p className="text-muted-foreground mt-1">{isAdmin ? "Hantera salonger och erbjudanden" : salonData?.email}</p>
        </div>
        <Button variant="outline" onClick={handleSignOut}>
          <LogOut className="mr-2 h-4 w-4" />
          Logga ut
        </Button>
      </div>

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
          {!isAdmin && (
            <TabsTrigger value="settings">
              <Settings className="mr-2 h-4 w-4" />
              Inställningar
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

        {!isAdmin && (
          <TabsContent value="settings">
            <Card className="p-6">
              <h2 className="text-xl font-semibold mb-4">Salong information</h2>
              <div className="space-y-2">
                <p><strong>Adress:</strong> {salonData?.address || "Ej angiven"}</p>
                <p><strong>Telefon:</strong> {salonData?.phone || "Ej angiven"}</p>
              </div>
            </Card>
          </TabsContent>
        )}
      </Tabs>
    </div>
  );
}