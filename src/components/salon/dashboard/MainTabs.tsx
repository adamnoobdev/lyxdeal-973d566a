
import { DealsSection } from "@/components/salon/DealsSection";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useSession } from "@/hooks/useSession";
import { useSalonDeals } from "@/hooks/salon-deals";
import { Deal } from "@/types/deal";
import { Card, CardContent } from "@/components/ui/card";

export function MainTabs() {
  const { session } = useSession();
  const [salonData, setSalonData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchSalonData = async () => {
      if (!session?.user?.id) return;
      
      try {
        const { data, error } = await supabase
          .from('salons')
          .select('*')
          .eq('user_id', session.user.id)
          .single();
        
        if (error) throw error;
        setSalonData(data);
      } catch (err) {
        console.error("Error fetching salon data:", err);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchSalonData();
  }, [session?.user?.id]);

  const salonId = salonData?.id;
  const emptyDeals: Deal[] = [];

  return (
    <Card className="border shadow-sm overflow-hidden">
      <CardContent className="p-6">
        <h3 className="text-lg font-medium mb-4">Dina erbjudanden</h3>
        <DealsSection 
          title=""
          deals={emptyDeals} 
          onEdit={() => {}} 
          onDelete={() => {}}
        />
      </CardContent>
    </Card>
  );
}
