
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Check, X, Users } from "lucide-react";
import { CollaborationApplication } from "@/types/collaboration";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";

interface ApplicationsTableProps {
  applications: CollaborationApplication[];
  onApprove: (id: string, collaborationId: string, creatorId: string) => Promise<void>;
  onReject: (id: string) => Promise<void>;
}

export const ApplicationsTable = ({ applications, onApprove, onReject }: ApplicationsTableProps) => {
  if (applications.length === 0) {
    return (
      <div className="text-center py-8 bg-gray-50 rounded-md border">
        <Users className="h-12 w-12 text-gray-400 mx-auto mb-3" />
        <h3 className="font-medium text-lg mb-1">Inga ansökningar</h3>
        <p className="text-muted-foreground">När kreatörer ansöker om samarbeten visas de här</p>
      </div>
    );
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return <Badge className="bg-yellow-500">Väntar</Badge>;
      case 'approved':
        return <Badge className="bg-green-500">Godkänd</Badge>;
      case 'rejected':
        return <Badge className="bg-red-500">Avvisad</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  return (
    <div className="border rounded-md">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Kreatör</TableHead>
            <TableHead>Samarbete</TableHead>
            <TableHead>Salong</TableHead>
            <TableHead>Behandling</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Ansökt</TableHead>
            <TableHead className="text-right">Åtgärder</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {applications.map((application) => (
            <TableRow key={application.id} className={application.status !== 'pending' ? "opacity-75" : ""}>
              <TableCell>{application.creator_email || '-'}</TableCell>
              <TableCell>{application.collaboration_title || '-'}</TableCell>
              <TableCell>{application.salon_name || '-'}</TableCell>
              <TableCell>{application.deal_title || '-'}</TableCell>
              <TableCell>{getStatusBadge(application.status)}</TableCell>
              <TableCell>{format(new Date(application.created_at), 'yyyy-MM-dd')}</TableCell>
              <TableCell className="text-right">
                {application.status === 'pending' ? (
                  <div className="flex justify-end gap-2">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="text-green-600 hover:text-green-700 hover:bg-green-50"
                      onClick={() => onApprove(application.id, application.collaboration_id, application.creator_id)}
                    >
                      <Check className="h-4 w-4" />
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="text-red-600 hover:text-red-700 hover:bg-red-50"
                      onClick={() => onReject(application.id)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ) : (
                  <span className="text-xs text-muted-foreground">
                    {application.status === 'approved' ? 'Godkänd' : 'Avvisad'}
                  </span>
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};
