
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
import { Loader2, AlertTriangle } from "lucide-react";

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
  emptyStateMessage?: string;
  inspectionResult?: any;
}

export const DiscountCodesTable = ({ 
  codes, 
  isLoading = false,
  emptyStateMessage = "Inga rabattkoder hittades för detta erbjudande.",
  inspectionResult
}: DiscountCodesTableProps) => {
  console.log("[DiscountCodesTable] Rendering with", codes.length, "codes, isLoading:", isLoading);
  
  const formatDate = (dateString: string | null) => {
    if (!dateString) return "—";
    return format(new Date(dateString), "yyyy-MM-dd HH:mm", { locale: sv });
  };

  if (isLoading) {
    return (
      <div className="w-full p-8 text-center">
        <div className="flex flex-col items-center justify-center gap-2">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <div className="text-muted-foreground">Laddar rabattkoder...</div>
        </div>
      </div>
    );
  }

  // Om vi har inspect-resultat men inga synliga koder, visa exempel
  const hasInspectionCodesMismatch = inspectionResult?.success && 
    inspectionResult?.codesCount > 0 && 
    codes.length === 0;

  if (!codes.length) {
    return (
      <div className="w-full p-8 text-center">
        <p className="text-muted-foreground mb-4">{emptyStateMessage}</p>
        
        {hasInspectionCodesMismatch && inspectionResult.sampleCodes && (
          <div className="mt-4 border border-yellow-200 bg-yellow-50 p-4 rounded-md max-w-md mx-auto">
            <div className="flex items-center gap-2 text-yellow-700 font-medium mb-2">
              <AlertTriangle className="h-5 w-5" />
              <span>Rabattkoder finns men visas inte</span>
            </div>
            <p className="text-yellow-600 text-sm mb-3">
              Inspektion hittade {inspectionResult.codesCount} koder i databasen. Här är några exempel:
            </p>
            <div className="bg-white p-3 rounded border border-yellow-200 text-xs font-mono text-left">
              {inspectionResult.sampleCodes.map((code: any, i: number) => (
                <div key={i} className="mb-1 pb-1 border-b border-yellow-100 last:border-0 last:mb-0 last:pb-0">
                  <div className="flex justify-between">
                    <span>{code.code}</span>
                    <span className="text-gray-500">{code.isUsed ? 'Använd' : 'Aktiv'}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
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
