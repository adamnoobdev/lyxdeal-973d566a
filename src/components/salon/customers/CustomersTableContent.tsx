
import { Table, TableBody, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { CustomerTableRow } from "./CustomerTableRow";
import { CustomerCodeData } from "./useCustomers";

interface CustomersTableContentProps {
  customers: CustomerCodeData[];
}

export const CustomersTableContent = ({ customers }: CustomersTableContentProps) => {
  return (
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
          {customers.map((customer) => (
            <CustomerTableRow 
              key={customer.id} 
              customer={customer} 
            />
          ))}
        </TableBody>
      </Table>
    </div>
  );
};
