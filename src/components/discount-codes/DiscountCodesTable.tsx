
import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { format } from "date-fns";
import { sv } from "date-fns/locale";

export interface DiscountCode {
  id: number;
  code: string;
  is_used: boolean;
  created_at: string;
  used_at: string | null;
  customer_name: string | null;
  customer_email: string | null;
  customer_phone: string | null;
}

interface DiscountCodesTableProps {
  codes: DiscountCode[];
  isLoading?: boolean;
}

export const DiscountCodesTable = ({ codes, isLoading = false }: DiscountCodesTableProps) => {
  const formatDate = (dateString: string | null) => {
    if (!dateString) return "—";
    return format(new Date(dateString), "yyyy-MM-dd HH:mm", { locale: sv });
  };

  if (isLoading) {
    return (
      <div className="w-full p-8 text-center">
        <div className="animate-pulse">Laddar rabattkoder...</div>
      </div>
    );
  }

  if (!codes.length) {
    return (
      <div className="w-full p-8 text-center">
        <p className="text-muted-foreground">Inga rabattkoder hittades för detta erbjudande.</p>
      </div>
    );
  }

  return (
    <ScrollArea className="w-full max-w-full overflow-auto">
      <div className="min-w-[640px]">
        <Table className="w-full">
          <TableHeader className="bg-gray-50">
            <TableRow>
              <TableHead className="w-40 font-medium text-primary">Rabattkod</TableHead>
              <TableHead className="w-28 font-medium text-primary">Status</TableHead>
              <TableHead className="w-40 font-medium text-primary">Skapad</TableHead>
              <TableHead className="w-40 font-medium text-primary">Använd</TableHead>
              <TableHead className="font-medium text-primary">Kundinformation</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {codes.map((code) => (
              <TableRow key={code.id} className="border-b border-gray-100">
                <TableCell className="font-mono">{code.code}</TableCell>
                <TableCell>
                  <Badge variant={code.is_used ? "secondary" : "default"}>
                    {code.is_used ? "Använd" : "Aktiv"}
                  </Badge>
                </TableCell>
                <TableCell>{formatDate(code.created_at)}</TableCell>
                <TableCell>{formatDate(code.used_at)}</TableCell>
                <TableCell>
                  {code.is_used && code.customer_name ? (
                    <div className="flex flex-col text-sm">
                      <span>{code.customer_name}</span>
                      {code.customer_email && (
                        <span className="text-muted-foreground text-xs">{code.customer_email}</span>
                      )}
                      {code.customer_phone && (
                        <span className="text-muted-foreground text-xs">{code.customer_phone}</span>
                      )}
                    </div>
                  ) : (
                    <span className="text-muted-foreground">—</span>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </ScrollArea>
  );
};
