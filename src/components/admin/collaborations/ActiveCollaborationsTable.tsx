
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Trash2, Users } from "lucide-react";
import { ActiveCollaboration } from "@/types/collaboration";
import { format } from "date-fns";

interface ActiveCollaborationsTableProps {
  collaborations: ActiveCollaboration[];
  onDelete: (id: string) => Promise<void>;
}

export const ActiveCollaborationsTable = ({ collaborations, onDelete }: ActiveCollaborationsTableProps) => {
  if (collaborations.length === 0) {
    return (
      <div className="text-center py-8 bg-gray-50 rounded-md border">
        <Users className="h-12 w-12 text-gray-400 mx-auto mb-3" />
        <h3 className="font-medium text-lg mb-1">Inga aktiva samarbeten</h3>
        <p className="text-muted-foreground">När kreatörer blir godkända för samarbeten visas de här</p>
      </div>
    );
  }

  return (
    <div className="border rounded-md">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Kreatör</TableHead>
            <TableHead>Salong</TableHead>
            <TableHead>Behandling</TableHead>
            <TableHead>Rabattkod</TableHead>
            <TableHead>Inlösningar</TableHead>
            <TableHead>Visningar</TableHead>
            <TableHead>Skapad</TableHead>
            <TableHead className="text-right">Åtgärder</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {collaborations.map((collaboration) => (
            <TableRow key={collaboration.id}>
              <TableCell>{collaboration.creator_email || '-'}</TableCell>
              <TableCell>{collaboration.salon_name || '-'}</TableCell>
              <TableCell>{collaboration.deal_title || '-'}</TableCell>
              <TableCell>
                <code className="bg-gray-100 px-2 py-1 rounded">{collaboration.discount_code}</code>
              </TableCell>
              <TableCell>{collaboration.redemptions}</TableCell>
              <TableCell>{collaboration.views}</TableCell>
              <TableCell>{format(new Date(collaboration.created_at), 'yyyy-MM-dd')}</TableCell>
              <TableCell className="text-right">
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => onDelete(collaboration.id)}
                  className="text-destructive hover:text-destructive"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};
