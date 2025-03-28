
import { Skeleton } from "@/components/ui/skeleton";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

export const PurchasesTableSkeleton = () => {
  return (
    <div className="rounded-md border">
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
          {Array(5).fill(0).map((_, index) => (
            <TableRow key={index}>
              <TableCell><Skeleton className="h-4 w-[140px]" /></TableCell>
              <TableCell><Skeleton className="h-4 w-[180px]" /></TableCell>
              <TableCell><Skeleton className="h-4 w-[100px]" /></TableCell>
              <TableCell><Skeleton className="h-5 w-[80px] rounded-full" /></TableCell>
              <TableCell><Skeleton className="h-4 w-[100px]" /></TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};
