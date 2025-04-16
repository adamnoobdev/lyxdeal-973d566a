
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Edit, Trash2, Users } from "lucide-react";
import { CollaborationRequest } from "@/types/collaboration";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";

interface CollaborationsTableProps {
  collaborationRequests: CollaborationRequest[];
  onEdit: (request: CollaborationRequest) => void;
  onDelete: (request: CollaborationRequest) => void;
}

export const CollaborationsTable = ({ collaborationRequests, onEdit, onDelete }: CollaborationsTableProps) => {
  if (collaborationRequests.length === 0) {
    return (
      <div className="text-center py-8 bg-gray-50 rounded-md border">
        <Users className="h-12 w-12 text-gray-400 mx-auto mb-3" />
        <h3 className="font-medium text-lg mb-1">Inga samarbetsförfrågningar</h3>
        <p className="text-muted-foreground">Skapa en ny samarbetsförfrågan för att börja</p>
      </div>
    );
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <Badge className="bg-green-500">Aktiv</Badge>;
      case 'completed':
        return <Badge className="bg-blue-500">Avslutad</Badge>;
      case 'cancelled':
        return <Badge className="bg-gray-500">Avbruten</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  // Desktop view
  const renderDesktopTable = () => (
    <div className="border rounded-md overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Titel</TableHead>
            <TableHead>Salong</TableHead>
            <TableHead>Behandling</TableHead>
            <TableHead>Ersättning</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Kreatörer</TableHead>
            <TableHead>Skapad</TableHead>
            <TableHead className="text-right">Åtgärder</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {collaborationRequests.map((request) => (
            <TableRow key={request.id}>
              <TableCell className="font-medium">{request.title}</TableCell>
              <TableCell>{request.salon_name || '-'}</TableCell>
              <TableCell>{request.deal_title || '-'}</TableCell>
              <TableCell>{request.compensation}</TableCell>
              <TableCell>{getStatusBadge(request.status)}</TableCell>
              <TableCell>{`${request.current_creators} / ${request.max_creators}`}</TableCell>
              <TableCell>{format(new Date(request.created_at), 'yyyy-MM-dd')}</TableCell>
              <TableCell className="text-right">
                <div className="flex justify-end gap-2">
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => onEdit(request)}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => onDelete(request)}
                    className="text-destructive hover:text-destructive"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
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
      {collaborationRequests.map((request) => (
        <div 
          key={request.id} 
          className="border rounded-md p-4"
        >
          <div className="flex justify-between items-start mb-2">
            <div>
              <h3 className="font-medium">{request.title}</h3>
              <p className="text-sm text-muted-foreground">
                {format(new Date(request.created_at), 'yyyy-MM-dd')}
              </p>
            </div>
            <div>{getStatusBadge(request.status)}</div>
          </div>
          
          <div className="grid grid-cols-2 gap-2 text-sm my-3">
            <div>
              <p className="text-muted-foreground">Salong</p>
              <p>{request.salon_name || '-'}</p>
            </div>
            <div>
              <p className="text-muted-foreground">Behandling</p>
              <p>{request.deal_title || '-'}</p>
            </div>
            <div>
              <p className="text-muted-foreground">Ersättning</p>
              <p>{request.compensation}</p>
            </div>
            <div>
              <p className="text-muted-foreground">Kreatörer</p>
              <p>{`${request.current_creators} / ${request.max_creators}`}</p>
            </div>
          </div>

          <div className="flex justify-end gap-2 mt-2">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => onEdit(request)}
            >
              <Edit className="h-4 w-4 mr-1" /> Redigera
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => onDelete(request)}
              className="text-red-600 hover:text-red-700 hover:bg-red-50"
            >
              <Trash2 className="h-4 w-4 mr-1" /> Ta bort
            </Button>
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
