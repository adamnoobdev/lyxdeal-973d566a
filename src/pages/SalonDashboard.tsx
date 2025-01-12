import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { LogOut, Settings, Scissors } from "lucide-react";
import { toast } from "sonner";

interface SalonData {
  id: number;
  name: string;
  email: string;
  phone: string | null;
  address: string | null;
  role: string;
}

export default function SalonDashboard() {
  const navigate = useNavigate();
  const [salonData, setSalonData] = useState<SalonData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkUser();
  }, []);

  const checkUser = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        navigate("/salon/login");
        return;
      }

      const { data: salon, error } = await supabase
        .from("salons")
        .select("*")
        .eq("user_id", session.user.id)
        .single();

      if (error) throw error;

      if (salon?.role === 'admin') {
        navigate("/admin");
        return;
      }

      setSalonData(salon);
      setLoading(false);
    } catch (error) {
      console.error("Error checking user:", error);
      toast.error("Det gick inte att hämta användarinformation");
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
          <h1 className="text-3xl font-bold">{salonData?.name}</h1>
          <p className="text-muted-foreground mt-1">{salonData?.email}</p>
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
          <TabsTrigger value="settings">
            <Settings className="mr-2 h-4 w-4" />
            Inställningar
          </TabsTrigger>
        </TabsList>

        <TabsContent value="deals">
          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4">Dina erbjudanden</h2>
            <p className="text-muted-foreground">
              Här kommer du kunna hantera dina erbjudanden.
            </p>
          </Card>
        </TabsContent>

        <TabsContent value="settings">
          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4">Salong information</h2>
            <div className="space-y-2">
              <p><strong>Adress:</strong> {salonData?.address || "Ej angiven"}</p>
              <p><strong>Telefon:</strong> {salonData?.phone || "Ej angiven"}</p>
            </div>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}