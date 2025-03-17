
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useSession } from "@/hooks/useSession";

export interface CustomerCodeData {
  id: number;
  code: string;
  customer_name?: string;
  customer_email?: string;
  customer_phone?: string;
  used_at: string;
  deals?: {
    title?: string;
  };
}

export const useCustomers = () => {
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

  const { data: customers, isLoading } = useQuery({
    queryKey: ['salon-customers', salonData?.id],
    queryFn: async () => {
      // Hämta alla rabattkoder som tillhör salongens erbjudanden och som har använts
      const { data: deals } = await supabase
        .from('deals')
        .select('id')
        .eq('salon_id', salonData?.id);

      if (!deals?.length) return [];

      const dealIds = deals.map(deal => deal.id);

      const { data, error } = await supabase
        .from('discount_codes')
        .select(`
          id, 
          code,
          customer_name, 
          customer_email, 
          customer_phone, 
          used_at,
          deals:deal_id(title)
        `)
        .in('deal_id', dealIds)
        .eq('is_used', true)
        .order('used_at', { ascending: false });

      if (error) throw error;
      return data;
    },
    enabled: !!salonData?.id,
  });

  return {
    customers,
    isLoading,
    salonData
  };
};

export const exportCustomersToCSV = (customers: CustomerCodeData[]) => {
  if (!customers?.length) return;
  
  const headers = ['Namn', 'E-post', 'Telefon', 'Erbjudande', 'Rabattkod', 'Säkrat datum'];
  
  const csvRows = [
    headers.join(','),
    ...customers.map(customer => {
      const values = [
        customer.customer_name || 'N/A',
        customer.customer_email || 'N/A',
        customer.customer_phone || 'N/A',
        customer.deals?.title || 'N/A',
        customer.code,
        new Date(customer.used_at).toLocaleDateString('sv-SE')
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
  link.setAttribute('download', `kunder-${new Date().toISOString().slice(0, 10)}.csv`);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};
