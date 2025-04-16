
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

  // Desktop view
  const renderDesktopTable = () => (
    <div className="border rounded-md overflow-hidden">
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
              <TableCell>{collaboration.creator_id}</TableCell>
              <TableCell>{collaboration.salon_name || '-'}</TableCell>
              <TableCell>{collaboration.deal_title || '-'}</TableCell>
              <TableCell>
                <code className="bg-gray-100 px-2 py-1 rounded text-sm">{collaboration.discount_code}</code>
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

  // Mobile view
  const renderMobileCards = () => (
    <div className="space-y-4">
      {collaborations.map((collaboration) => (
        <div 
          key={collaboration.id} 
          className="border rounded-md p-4"
        >
          <div className="flex justify-between items-start">
            <div>
              <p className="font-medium">{collaboration.creator_id}</p>
              <p className="text-sm text-muted-foreground">
                {format(new Date(collaboration.created_at), 'yyyy-MM-dd')}
              </p>
            </div>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => onDelete(collaboration.id)}
              className="text-destructive hover:text-destructive"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
          
          <div className="grid grid-cols-2 gap-3 text-sm my-3">
            <div>
              <p className="text-muted-foreground">Salong</p>
              <p>{collaboration.salon_name || '-'}</p>
            </div>
            <div>
              <p className="text-muted-foreground">Behandling</p>
              <p>{collaboration.deal_title || '-'}</p>
            </div>
            <div>
              <p className="text-muted-foreground">Rabattkod</p>
              <code className="bg-gray-100 px-2 py-1 rounded block text-sm mt-1">{collaboration.discount_code}</code>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <p className="text-muted-foreground">Inlösningar</p>
                <p className="font-medium">{collaboration.redemptions}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Visningar</p>
                <p className="font-medium">{collaboration.views}</p>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );

  return (
    <>
      {/* Desktop view (hidden on mobile) */}
      <div className="hidden md:block">
        {renderDesktopTable()}
      </div>
      
      {/* Mobile view (hidden on desktop) */}
      <div className="md:hidden">
        {renderMobileCards()}
      </div>
    </>
  );
};
