
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useSession } from "@/hooks/useSession";
import { toast } from "sonner";

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

  const { data: salonData, error: salonError } = useQuery({
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

  const { data: purchases, isLoading, error } = useQuery({
    queryKey: ['salon-purchases', salonData?.id],
    queryFn: async () => {
      try {
        // Hämta alla rabattkoder som tillhör salongens erbjudanden
        const { data: deals, error: dealsError } = await supabase
          .from('deals')
          .select('id')
          .eq('salon_id', salonData?.id);

        if (dealsError) throw dealsError;
        
        if (!deals?.length) {
          console.log('No deals found for salon ID:', salonData?.id);
          return [];
        }

        const dealIds = deals.map(deal => deal.id);
        console.log('Found deal IDs:', dealIds);

        // Hämta data från både purchases och discount_codes tabellerna
        // Först från purchases-tabellen för att få alla "köp"
        const { data: purchasesData, error: purchasesError } = await supabase
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

        if (purchasesError) throw purchasesError;
        
        // Sedan från discount_codes tabellen för att få alla använda rabattkoder
        const { data: discountCodesData, error: discountCodesError } = await supabase
          .from('discount_codes')
          .select(`
            id,
            customer_email,
            code,
            used_at,
            created_at,
            deal_id,
            deals:deal_id(title)
          `)
          .in('deal_id', dealIds)
          .eq('is_used', true)
          .order('created_at', { ascending: false });

        if (discountCodesError) throw discountCodesError;
        
        // Kombinera data från båda tabellerna och formatera dem till Purchase-formatet
        const formattedDiscountCodes = discountCodesData.map(code => ({
          id: code.id,
          customer_email: code.customer_email || 'anonym@användare.se',
          discount_code: code.code,
          created_at: code.used_at || code.created_at,
          deals: code.deals
        }));
        
        // Slå ihop och ta bort eventuella dubbletter baserat på rabattkoden
        const allCodes = [...purchasesData];
        const usedCodes = new Set(allCodes.map(p => p.discount_code));
        
        // Lägg till rabattkoder från discount_codes som inte redan finns i purchasesData
        for (const code of formattedDiscountCodes) {
          if (!usedCodes.has(code.discount_code)) {
            allCodes.push(code);
            usedCodes.add(code.discount_code);
          }
        }
        
        // Sortera efter datum, nyaste först
        allCodes.sort((a, b) => 
          new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        );
        
        console.log(`Found ${allCodes.length} total claimed discount codes`);
        return allCodes;
      } catch (error: any) {
        console.error('Error fetching discount codes history:', error);
        toast.error('Kunde inte hämta rabattkodshistorik');
        throw error;
      }
    },
    enabled: !!salonData?.id,
  });

  return {
    purchases,
    isLoading,
    error,
  };
};

export const exportPurchasesToCSV = (purchases: Purchase[]) => {
  if (!purchases?.length) {
    toast.warning('Inga rabattkoder att exportera');
    return;
  }
  
  const headers = ['Erbjudande', 'Kund', 'Rabattkod', 'Status', 'Datum'];
  
  const csvRows = [
    headers.join(','),
    ...purchases.map(purchase => {
      const values = [
        purchase.deals?.title || 'Okänt erbjudande',
        purchase.customer_email,
        purchase.discount_code,
        'Utlämnad',
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
  link.setAttribute('download', `rabattkoder-${new Date().toISOString().slice(0, 10)}.csv`);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};
