
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
import { format } from "date-fns";
import { sv } from "date-fns/locale";

interface DiscountCode {
  id: number;
  code: string;
  is_used: boolean;
  created_at: string;
  used_at: string | null;
  customer_name: string | null;
  customer_email: string | null;
  customer_phone: string | null;
}

interface DiscountCodesListProps {
  codes: DiscountCode[];
}

export const DiscountCodesList = ({ codes }: DiscountCodesListProps) => {
  const formatDate = (dateString: string | null) => {
    if (!dateString) return "—";
    return format(new Date(dateString), "yyyy-MM-dd HH:mm", { locale: sv });
  };

  return (
    <div className="w-full overflow-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-40">Rabattkod</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Skapad</TableHead>
            <TableHead>Använd</TableHead>
            <TableHead>Kundinformation</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {codes.map((code) => (
            <TableRow key={code.id}>
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
                  <div className="flex flex-col">
                    <span>{code.customer_name}</span>
                    {code.customer_email && (
                      <span className="text-xs text-muted-foreground">{code.customer_email}</span>
                    )}
                    {code.customer_phone && (
                      <span className="text-xs text-muted-foreground">{code.customer_phone}</span>
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
  );
};
