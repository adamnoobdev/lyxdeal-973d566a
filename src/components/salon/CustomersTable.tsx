
import { useSession } from "@/hooks/useSession";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { formatDistance } from "date-fns";
import { sv } from "date-fns/locale";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Download, Mail, Phone, Tag } from "lucide-react";

export function CustomersTable() {
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

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="h-8 w-full bg-secondary animate-pulse rounded"></div>
        <div className="space-y-2">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-16 w-full bg-secondary/20 animate-pulse rounded"></div>
          ))}
        </div>
      </div>
    );
  }

  if (!customers?.length) {
    return (
      <Card className="bg-white border border-gray-100">
        <CardHeader>
          <CardTitle>Inga kunder ännu</CardTitle>
          <CardDescription>
            När kunder säkrar dina erbjudanden kommer de att visas här
          </CardDescription>
        </CardHeader>
        <CardContent className="flex justify-center py-6">
          <div className="text-center text-muted-foreground">
            <Tag className="mx-auto h-10 w-10 text-muted-foreground/40 mb-3" />
            <p>Inga rabattkoder har använts ännu.</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Exportera kunddata till CSV
  const exportToCSV = () => {
    if (!customers) return;
    
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

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">Kunder som säkrat erbjudanden</h3>
        <Button 
          variant="outline" 
          size="sm" 
          onClick={exportToCSV}
          className="text-xs"
        >
          <Download className="h-3 w-3 mr-1" />
          Exportera
        </Button>
      </div>
      
      <div className="border rounded-md overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Namn</TableHead>
              <TableHead>Kontakt</TableHead>
              <TableHead>Erbjudande</TableHead>
              <TableHead>Rabattkod</TableHead>
              <TableHead>Säkrat</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {customers.map((customer) => {
              const timeAgo = formatDistance(
                new Date(customer.used_at),
                new Date(),
                { addSuffix: true, locale: sv }
              );
              
              const isValid = new Date(customer.used_at).getTime() + (72 * 60 * 60 * 1000) > new Date().getTime();
              
              return (
                <TableRow key={customer.id}>
                  <TableCell className="font-medium">
                    {customer.customer_name || 'Anonym'}
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-col gap-1">
                      {customer.customer_email && (
                        <a 
                          href={`mailto:${customer.customer_email}`} 
                          className="flex items-center text-xs text-blue-600 hover:underline"
                        >
                          <Mail className="h-3 w-3 mr-1" /> {customer.customer_email}
                        </a>
                      )}
                      {customer.customer_phone && (
                        <a 
                          href={`tel:${customer.customer_phone}`} 
                          className="flex items-center text-xs text-blue-600 hover:underline"
                        >
                          <Phone className="h-3 w-3 mr-1" /> {customer.customer_phone}
                        </a>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    {customer.deals?.title || 'Okänt erbjudande'}
                  </TableCell>
                  <TableCell className="font-mono text-xs">
                    {customer.code}
                  </TableCell>
                  <TableCell className="text-xs text-muted-foreground">
                    {timeAgo}
                  </TableCell>
                  <TableCell>
                    <Badge variant={isValid ? "outline" : "destructive"} className="text-xs">
                      {isValid ? 'Giltig' : 'Utgången'}
                    </Badge>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
