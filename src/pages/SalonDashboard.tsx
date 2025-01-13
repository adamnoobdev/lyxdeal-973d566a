import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { LogOut, Settings, Scissors, ShoppingBag } from "lucide-react";
import { toast } from "sonner";
import { ProfileSettings } from "@/components/salon/ProfileSettings";
import { PurchasesTable } from "@/components/salon/PurchasesTable";
import { useQuery } from "@tanstack/react-query";

interface SalonData {
  id: number;
  name: string;
  email: string;
  phone: string | null;
  address: string | null;
  role: string;
  user_id: string | null;
}

interface Purchase {
  id: number;
  customer_email: string;
  discount_code: string;
  created_at: string;
  deals: {
    title: string;
  };
}

interface DealStats {
  deal_id: number;
  title: string;
  total_purchases: number;
}

export default function SalonDashboard() {
  const navigate = useNavigate();
  const [salonData, setSalonData] = useState<SalonData | null>(null);

  const { data: purchases, isLoading: purchasesLoading } = useQuery({
    queryKey: ['salon-purchases'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('purchases')
        .select(`
          id,
          customer_email,
          discount_code,
          created_at,
          deals (
            title
          )
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data as Purchase[];
    },
    enabled: !!salonData,
  });

  const { data: dealStats } = useQuery({
    queryKey: ['salon-deal-stats'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('purchases')
        .select(`
          deals!inner (
            id,
            title
          ),
          count
        `)
        .eq('deals.salon_id', salonData?.id)
        .select('deal_id, count(*)')
        .groupBy('deal_id, deals.id, deals.title');

      if (error) throw error;
      
      return data.map(deal => ({
        deal_id: deal.deals.id,
        title: deal.deals.title,
        total_purchases: parseInt(deal.count),
      })) as DealStats[];
    },
    enabled: !!salonData,
  });

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
    } catch (error) {
      console.error("Error checking user:", error);
      toast.error("Det gick inte att hämta användarinformation");
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

  if (!salonData) {
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
          <h1 className="text-3xl font-bold">{salonData.name}</h1>
          <p className="text-muted-foreground mt-1">{salonData.email}</p>
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
          <TabsTrigger value="purchases">
            <ShoppingBag className="mr-2 h-4 w-4" />
            Köp
          </TabsTrigger>
          <TabsTrigger value="settings">
            <Settings className="mr-2 h-4 w-4" />
            Inställningar
          </TabsTrigger>
        </TabsList>

        <TabsContent value="deals">
          <div className="grid gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Statistik</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {dealStats?.map((stat) => (
                    <div key={stat.deal_id} className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">{stat.title}</span>
                      <span className="font-medium">{stat.total_purchases} köp</span>
                    </div>
                  ))}
                  {!dealStats?.length && (
                    <p className="text-sm text-muted-foreground">
                      Inga köp har gjorts än
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="purchases">
          <Card>
            <CardHeader>
              <CardTitle>Köphistorik</CardTitle>
            </CardHeader>
            <CardContent>
              {purchasesLoading ? (
                <div className="animate-pulse space-y-4">
                  <div className="h-12 bg-muted rounded" />
                  <div className="h-12 bg-muted rounded" />
                  <div className="h-12 bg-muted rounded" />
                </div>
              ) : purchases?.length ? (
                <PurchasesTable purchases={purchases} />
              ) : (
                <p className="text-center text-muted-foreground py-8">
                  Inga köp har gjorts än
                </p>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="settings">
          <ProfileSettings 
            salon={salonData} 
            onUpdate={checkUser}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}