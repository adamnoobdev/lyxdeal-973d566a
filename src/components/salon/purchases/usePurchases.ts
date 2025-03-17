
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useSession } from "@/hooks/useSession";

export interface Purchase {
  id: number;
  customer_email: string;
  discount_code: string;
  created_at: string;
  deals?: {
    title: string;
  };
}

export const usePurchases = () => {
  const { session } = useSession();

  const { data: salonData } = useQuery({
    queryKey: ['salon', session?.user.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('salons')
        .select('id')
        .eq('user_id', session?.user.id)
        .single();

      if (error) throw error;
      return data;
    },
    enabled: !!session?.user.id,
  });

  const { data: purchases, isLoading } = useQuery({
    queryKey: ['salon-purchases', salonData?.id],
    queryFn: async () => {
      // Hämta alla köp som tillhör salongens erbjudanden
      const { data: deals } = await supabase
        .from('deals')
        .select('id')
        .eq('salon_id', salonData?.id);

      if (!deals?.length) return [];

      const dealIds = deals.map(deal => deal.id);

      const { data, error } = await supabase
        .from('purchases')
        .select(`
          id, 
          customer_email,
          discount_code,
          created_at,
          deals:deal_id(title)
        `)
        .in('deal_id', dealIds)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data;
    },
    enabled: !!salonData?.id,
  });

  return {
    purchases,
    isLoading,
  };
};

export const exportPurchasesToCSV = (purchases: Purchase[]) => {
  if (!purchases?.length) return;
  
  const headers = ['Erbjudande', 'Kund', 'Rabattkod', 'Datum'];
  
  const csvRows = [
    headers.join(','),
    ...purchases.map(purchase => {
      const values = [
        purchase.deals?.title || 'N/A',
        purchase.customer_email,
        purchase.discount_code,
        new Date(purchase.created_at).toLocaleDateString('sv-SE')
      ];
      
      // Escapa värden som innehåller kommatecken
      const escapedValues = values.map(value => {
        if (value.includes(',')) {
          return `"${value}"`;
        }
        return value;
      });
      
      return escapedValues.join(',');
    })
  ].join('\n');
  
  const blob = new Blob([csvRows], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', `köp-${new Date().toISOString().slice(0, 10)}.csv`);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};
