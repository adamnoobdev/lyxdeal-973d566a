
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { format } from "date-fns";
import { sv } from "date-fns/locale";
import { Badge } from "@/components/ui/badge";

interface Purchase {
  id: number;
  customer_email: string;
  discount_code: string;
  created_at: string;
  deals?: {
    title: string;
  };
}

interface PurchasesTableContentProps {
  purchases: Purchase[];
}

export const PurchasesTableContent = ({ purchases }: PurchasesTableContentProps) => {
  return (
    <div className="rounded-md border overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Erbjudande</TableHead>
            <TableHead>Kund</TableHead>
            <TableHead>Rabattkod</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Datum</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {purchases.map((purchase) => (
            <PurchaseTableRow key={purchase.id} purchase={purchase} />
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

interface PurchaseTableRowProps {
  purchase: Purchase;
}

const PurchaseTableRow = ({ purchase }: PurchaseTableRowProps) => {
  // Alla rabattkoder i purchase-tabellen är använda/utdelade
  const status = "Utlämnad";

  return (
    <TableRow>
      <TableCell>{purchase.deals?.title || "Okänt erbjudande"}</TableCell>
      <TableCell>{purchase.customer_email}</TableCell>
      <TableCell className="font-mono">{purchase.discount_code}</TableCell>
      <TableCell>
        <Badge variant="secondary">{status}</Badge>
      </TableCell>
      <TableCell>
        {format(new Date(purchase.created_at), "d MMMM yyyy", { locale: sv })}
      </TableCell>
    </TableRow>
  );
};
