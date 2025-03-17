
import { formatDistance } from "date-fns";
import { sv } from "date-fns/locale";
import { Badge } from "@/components/ui/badge";
import { TableCell, TableRow } from "@/components/ui/table";
import { CustomerActions } from "./CustomerActions";

interface CustomerCodeData {
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

interface CustomerTableRowProps {
  customer: CustomerCodeData;
}

export const CustomerTableRow = ({ customer }: CustomerTableRowProps) => {
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
        <CustomerActions 
          email={customer.customer_email} 
          phone={customer.customer_phone} 
        />
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
};
