
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useSession } from "@/hooks/useSession";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

export function MainTabs() {
  const { session } = useSession();
  const [salonData, setSalonData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

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

  const goToDealsPage = () => {
    navigate('/salon/deal');
  };

  return (
    <Card className="border shadow-sm overflow-hidden">
      <CardContent className="p-6">
        <h3 className="text-lg font-medium mb-4">Översikt</h3>
        <p className="text-muted-foreground mb-6">
          Här kan du se en översikt över dina aktiviteter. För att hantera dina erbjudanden, gå till "Erbjudanden"-fliken.
        </p>
        <Button 
          variant="outline" 
          onClick={goToDealsPage}
          className="mt-2"
        >
          Gå till erbjudanden
        </Button>
      </CardContent>
    </Card>
  );
}
