
import { useSession } from "@/hooks/useSession";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { SalonLayout } from "@/components/salon/layout/SalonLayout";
import { SalonCollaborationsContent } from "@/components/salon/collaborations/SalonCollaborationsContent";
import { Helmet } from "react-helmet";

export default function SalonCollaborations() {
  const { session } = useSession();

  const { data: salonData } = useQuery({
    queryKey: ['salon', session?.user.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('salons')
        .select('*')
        .eq('user_id', session?.user.id)
        .single();

      if (error) throw error;
      return data;
    },
    enabled: !!session?.user.id,
  });

  const salonId = salonData?.id;

  return (
    <SalonLayout>
      <Helmet>
        <title>Samarbeten | Lyxdeal</title>
      </Helmet>
      
      <SalonCollaborationsContent salonId={salonId} />
    </SalonLayout>
  );
}
