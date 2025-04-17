
import { TableCell, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { formatDistanceToNow } from "date-fns";
import { sv } from "date-fns/locale";

interface Collaboration {
  id: string;
  discount_code: string;
  created_at: string;
  views: number;
  redemptions: number;
}

interface CollaborationTableBodyProps {
  collaborations: Collaboration[];
  searchTerm: string;
}

export function CollaborationTableBody({ collaborations, searchTerm }: CollaborationTableBodyProps) {
  // Log data for debugging
  console.log('CollaborationTableBody received:', { 
    collaborationCount: collaborations?.length || 0,
    firstItem: collaborations?.[0] || 'none', 
    searchTerm 
  });

  // Filter collaborations based on search term
  const filteredCollaborations = collaborations.filter(collab => {
    if (!collab) return false;
    const searchLower = searchTerm.toLowerCase();
    return (
      (collab.discount_code && collab.discount_code.toLowerCase().includes(searchLower)) ||
      (collab.id && collab.id.toString().toLowerCase().includes(searchLower))
    );
  });

  if (filteredCollaborations.length === 0) {
    return (
      <TableRow>
        <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
          {searchTerm ? 'Inga samarbeten matchar din sökning.' : 'Inga samarbeten hittades.'}
        </TableCell>
      </TableRow>
    );
  }

  return (
    <>
      {filteredCollaborations.map((collab) => {
        if (!collab) return null;
        
        const conversionRate = collab.views > 0 
          ? ((collab.redemptions / collab.views) * 100).toFixed(1) 
          : "0.0";
        
        // Update badge variant logic to use strict type matching
        let badgeVariant: "secondary" | "success" | "default" = "secondary";
        const rate = parseFloat(conversionRate);
        
        if (rate > 10) {
          badgeVariant = "default";
        } else if (rate > 5) {
          badgeVariant = "success";
        }
        
        return (
          <TableRow key={collab.id} className="group hover:bg-muted/40">
            <TableCell className="font-medium">
              <Badge variant="outline" className="font-mono">
                {collab.discount_code || 'N/A'}
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
              <Badge variant={badgeVariant}>
                {conversionRate}%
              </Badge>
            </TableCell>
          </TableRow>
        );
      })}
    </>
  );
}
