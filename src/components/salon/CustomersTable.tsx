
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Copy, Inbox } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Customer {
  id: number;
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  code: string;
  is_used: boolean;
  used_at: string | null;
  deal_title?: string;
}

export const CustomersTable = () => {
  const { dealId } = useParams();
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCustomers = async () => {
      setIsLoading(true);
      setError(null);
      try {
        let query = supabase
          .from("discount_codes")
          .select(`
            *,
            deals:deal_id (
              title
            )
          `)
          .not("customer_email", "is", null);

        // Om vi är på en specifik erbjudandesida, filtrera efter deal_id
        if (dealId) {
          query = query.eq("deal_id", parseInt(dealId));
        }

        const { data, error } = await query;

        if (error) throw error;

        // Transformera data till rätt format
        const formattedCustomers = data.map((customer) => ({
          id: customer.id,
          customer_name: customer.customer_name || "Okänd",
          customer_email: customer.customer_email || "",
          customer_phone: customer.customer_phone || "",
          code: customer.code,
          is_used: customer.is_used || false,
          used_at: customer.used_at,
          deal_title: customer.deals?.title || "Okänt erbjudande",
        }));

        setCustomers(formattedCustomers);
      } catch (err: any) {
        console.error("Fel vid hämtning av kunder:", err);
        setError(err.message);
        toast.error("Ett fel uppstod när kundlistan skulle hämtas");
      } finally {
        setIsLoading(false);
      }
    };

    fetchCustomers();
  }, [dealId]);

  const handleCopyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    toast.success("Rabattkoden har kopierats!");
  };

  // Filtrera kunder baserat på om rabattkoden är använd eller inte
  const redeemedCodes = customers.filter(customer => customer.is_used);
  const pendingCodes = customers.filter(customer => !customer.is_used);

  if (isLoading) {
    return (
      <Card className="p-6">
        <div className="space-y-2">
          <div className="h-4 w-36 bg-muted animate-pulse rounded"></div>
          <div className="h-8 w-full bg-muted animate-pulse rounded"></div>
          <div className="h-8 w-full bg-muted animate-pulse rounded"></div>
          <div className="h-8 w-full bg-muted animate-pulse rounded"></div>
        </div>
      </Card>
    );
  }

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertDescription>
          Kunde inte hämta kundlistan: {error}
        </AlertDescription>
      </Alert>
    );
  }

  if (customers.length === 0) {
    return (
      <Alert>
        <Inbox className="h-4 w-4 mr-2" />
        <AlertDescription>
          Inga kunder har signat upp för erbjudanden ännu.
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <Card className="border border-secondary/20 rounded-lg overflow-hidden shadow-sm">
      <Tabs defaultValue="pending" className="w-full">
        <TabsList className="mb-4 mx-4 mt-4 w-full max-w-md bg-secondary/10 border border-secondary/30">
          <TabsTrigger value="pending" className="flex-1 data-[state=active]:bg-white data-[state=active]:text-primary data-[state=active]:shadow-sm">
            Outnyttjade koder ({pendingCodes.length})
          </TabsTrigger>
          <TabsTrigger value="redeemed" className="flex-1 data-[state=active]:bg-white data-[state=active]:text-primary data-[state=active]:shadow-sm">
            Använda koder ({redeemedCodes.length})
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="pending" className="px-1">
          {renderCustomersTable(pendingCodes, handleCopyCode, !dealId)}
        </TabsContent>
        
        <TabsContent value="redeemed" className="px-1">
          {renderCustomersTable(redeemedCodes, handleCopyCode, !dealId)}
        </TabsContent>
      </Tabs>
    </Card>
  );
};

const renderCustomersTable = (
  customers: Customer[], 
  onCopyCode: (code: string) => void,
  showDealColumn: boolean
) => {
  if (customers.length === 0) {
    return (
      <Alert className="m-4">
        <Inbox className="h-4 w-4 mr-2" />
        <AlertDescription>
          Inga kunder i denna kategori.
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <ScrollArea className="h-full max-h-[60vh]">
      <div className="w-full">
        <Table>
          <TableHeader className="bg-primary/5 sticky top-0 z-10">
            <TableRow>
              <TableHead className="font-semibold text-primary">Namn</TableHead>
              <TableHead className="font-semibold text-primary">E-post</TableHead>
              <TableHead className="font-semibold text-primary">Telefon</TableHead>
              {showDealColumn && (
                <TableHead className="font-semibold text-primary">Erbjudande</TableHead>
              )}
              <TableHead className="font-semibold text-primary">Rabattkod</TableHead>
              <TableHead className="font-semibold text-primary w-[100px]">Åtgärder</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {customers.map((customer) => (
              <TableRow key={customer.id}>
                <TableCell>{customer.customer_name}</TableCell>
                <TableCell>{customer.customer_email}</TableCell>
                <TableCell>{customer.customer_phone}</TableCell>
                {showDealColumn && (
                  <TableCell>{customer.deal_title}</TableCell>
                )}
                <TableCell className="font-mono">{customer.code}</TableCell>
                <TableCell>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => onCopyCode(customer.code)}
                    title="Kopiera kod"
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </ScrollArea>
  );
};
