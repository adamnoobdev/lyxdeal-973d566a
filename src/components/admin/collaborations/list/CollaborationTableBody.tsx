
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
  // Förbättrad loggning för felsökning
  console.log('CollaborationTableBody renderering:', { 
    samarbetesAntal: collaborations?.length || 0,
    förstaObjekt: collaborations?.[0] ? JSON.stringify(collaborations[0]) : 'inget',
    sökterm: searchTerm
  });

  // Säkerställ att collaborations är en array
  if (!Array.isArray(collaborations)) {
    console.error('Felaktigt dataformat: collaborations är inte en array:', collaborations);
    collaborations = [];
  }

  // Filter collaborations based on search term med förbättrad felhantering
  const filteredCollaborations = collaborations.filter(collab => {
    if (!collab) {
      console.warn('Ignorerar ogiltig kollaboration i filtreringen:', collab);
      return false;
    }
    
    try {
      const searchLower = (searchTerm || '').toLowerCase();
      return (
        (collab.discount_code && collab.discount_code.toLowerCase().includes(searchLower)) ||
        (collab.id && collab.id.toString().toLowerCase().includes(searchLower))
      );
    } catch (err) {
      console.error('Fel vid filtrering av kollaboration:', err, collab);
      return false;
    }
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
      {filteredCollaborations.map((collab, index) => {
        if (!collab) {
          console.warn('Hoppade över ogiltig kollaboration:', collab, 'på index:', index);
          return null;
        }
        
        // Hantera numeriska värden säkert med fallback
        const views = typeof collab.views === 'number' ? collab.views : 0;
        const redemptions = typeof collab.redemptions === 'number' ? collab.redemptions : 0;
        
        // Beräkna konverteringsgrad med skydd mot division med noll
        const conversionRate = views > 0 
          ? ((redemptions / views) * 100).toFixed(1) 
          : "0.0";
        
        // Sätt badge-variant baserat på konverteringsgraden
        let badgeVariant: "secondary" | "success" | "default" = "secondary";
        const rate = parseFloat(conversionRate);
        
        if (rate > 10) {
          badgeVariant = "default";
        } else if (rate > 5) {
          badgeVariant = "success";
        }
        
        return (
          <TableRow key={collab.id || index} className="group hover:bg-muted/40">
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
            <TableCell className="text-center">{views}</TableCell>
            <TableCell className="text-center">{redemptions}</TableCell>
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
