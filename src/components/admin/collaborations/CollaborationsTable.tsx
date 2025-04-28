
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Edit, Trash2 } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { sv } from "date-fns/locale";
import { Badge } from "@/components/ui/badge";
import { CollaborationRequest } from "@/types/collaboration";

interface CollaborationsTableProps {
  collaborationRequests: CollaborationRequest[];
  onEdit: (request: CollaborationRequest) => void;
  onDelete: (request: CollaborationRequest) => void;
}

export const CollaborationsTable = ({
  collaborationRequests,
  onEdit,
  onDelete,
}: CollaborationsTableProps) => {
  return (
    <div className="rounded-md border overflow-hidden">
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Titel</TableHead>
              <TableHead className="hidden md:table-cell">Salong</TableHead>
              <TableHead className="hidden md:table-cell">Erbjudande</TableHead>
              <TableHead className="hidden md:table-cell">Skapad</TableHead>
              <TableHead className="hidden sm:table-cell text-center">Status</TableHead>
              <TableHead className="text-right">Åtgärder</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {collaborationRequests.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                  Inga samarbetsförfrågningar hittades.
                </TableCell>
              </TableRow>
            ) : (
              collaborationRequests.map((request) => (
                <TableRow key={request.id} className="group">
                  <TableCell className="font-medium">{request.title}</TableCell>
                  <TableCell className="hidden md:table-cell">{request.salon_name}</TableCell>
                  <TableCell className="hidden md:table-cell">{request.deal_title}</TableCell>
                  <TableCell className="hidden md:table-cell">
                    {formatDistanceToNow(new Date(request.created_at), {
                      addSuffix: true,
                      locale: sv,
                    })}
                  </TableCell>
                  <TableCell className="hidden sm:table-cell text-center">
                    <StatusBadge status={request.status} />
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => onEdit(request)}
                      >
                        <Edit className="h-4 w-4" />
                        <span className="sr-only">Redigera</span>
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => onDelete(request)}
                      >
                        <Trash2 className="h-4 w-4" />
                        <span className="sr-only">Ta bort</span>
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

const StatusBadge = ({ status }: { status: 'active' | 'completed' | 'cancelled' }) => {
  const variants = {
    active: "bg-green-50 text-green-700 border-green-200",
    completed: "bg-blue-50 text-blue-700 border-blue-200",
    cancelled: "bg-red-50 text-red-700 border-red-200",
  };

  const labels = {
    active: "Aktiv",
    completed: "Avslutad",
    cancelled: "Avbruten",
  };

  return (
    <Badge variant="outline" className={variants[status]}>
      {labels[status]}
    </Badge>
  );
};
