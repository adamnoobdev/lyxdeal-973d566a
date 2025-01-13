import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { format } from "date-fns";
import { sv } from "date-fns/locale";

interface Purchase {
  id: number;
  customer_email: string;
  discount_code: string;
  created_at: string;
  deals?: {
    title: string;
  };
}

interface PurchasesTableProps {
  purchases: Purchase[];
}

export const PurchasesTable = ({ purchases }: PurchasesTableProps) => {
  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Erbjudande</TableHead>
            <TableHead>Kund</TableHead>
            <TableHead>Rabattkod</TableHead>
            <TableHead>Datum</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {purchases.map((purchase) => (
            <TableRow key={purchase.id}>
              <TableCell>{purchase.deals?.title}</TableCell>
              <TableCell>{purchase.customer_email}</TableCell>
              <TableCell className="font-mono">{purchase.discount_code}</TableCell>
              <TableCell>
                {format(new Date(purchase.created_at), "d MMMM yyyy", { locale: sv })}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};