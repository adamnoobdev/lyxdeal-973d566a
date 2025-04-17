
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableHead, TableBody, TableRow, TableCell, TableHeader } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { formatDistanceToNow } from "date-fns";
import { sv } from "date-fns/locale";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

export function ActiveCollaborationsList({ collaborations }) {
  const [searchTerm, setSearchTerm] = useState('');
  
  const filteredCollaborations = collaborations.filter(collab => {
    const searchLower = searchTerm.toLowerCase();
    // Add more searchable fields as needed
    return (
      collab.discount_code?.toLowerCase().includes(searchLower) ||
      collab.id?.toLowerCase().includes(searchLower)
    );
  });

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <CardTitle>Aktiva samarbeten</CardTitle>
          <div className="relative">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Sök på rabattkod..."
              className="pl-8 w-full sm:w-[250px]"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="rounded-md border overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Rabattkod</TableHead>
                <TableHead className="hidden sm:table-cell">Skapad</TableHead>
                <TableHead className="text-center">Visningar</TableHead>
                <TableHead className="text-center">Inlösta</TableHead>
                <TableHead className="text-center">Konvertering</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredCollaborations.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                    Inga samarbeten hittades.
                  </TableCell>
                </TableRow>
              ) : (
                filteredCollaborations.map((collab) => {
                  const conversionRate = collab.views > 0 
                    ? ((collab.redemptions / collab.views) * 100).toFixed(1) 
                    : "0.0";
                  
                  return (
                    <TableRow key={collab.id}>
                      <TableCell className="font-medium">
                        <Badge variant="outline" className="font-mono">
                          {collab.discount_code}
                        </Badge>
                      </TableCell>
                      <TableCell className="hidden sm:table-cell text-muted-foreground">
                        {collab.created_at ? (
                          formatDistanceToNow(new Date(collab.created_at), { 
                            addSuffix: true,
                            locale: sv 
                          })
                        ) : (
                          "Okänt datum"
                        )}
                      </TableCell>
                      <TableCell className="text-center">{collab.views || 0}</TableCell>
                      <TableCell className="text-center">{collab.redemptions || 0}</TableCell>
                      <TableCell className="text-center">
                        <Badge variant={parseFloat(conversionRate) > 5 ? "success" : "secondary"}>
                          {conversionRate}%
                        </Badge>
                      </TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        </div>
        <div className="text-xs text-muted-foreground mt-4 text-center">
          Visar {filteredCollaborations.length} av totalt {collaborations.length} samarbeten
        </div>
      </CardContent>
    </Card>
  );
}
