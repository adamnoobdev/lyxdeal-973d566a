
import { CollaborationApplication } from "@/types/collaboration";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatDistanceToNow } from 'date-fns';
import { sv } from 'date-fns/locale';

interface ApplicationCardProps {
  application: CollaborationApplication;
}

export const ApplicationCard = ({ application }: ApplicationCardProps) => {
  const getBadgeVariant = (status: string) => {
    switch (status) {
      case 'approved':
        return { variant: 'outline' as const, className: 'bg-green-50 text-green-700 border-green-200' };
      case 'rejected':
        return { variant: 'outline' as const, className: 'bg-red-50 text-red-700 border-red-200' };
      case 'pending':
      default:
        return { variant: 'outline' as const, className: 'bg-yellow-50 text-yellow-700 border-yellow-200' };
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'approved':
        return 'Godkänd';
      case 'rejected':
        return 'Nekad';
      case 'pending':
      default:
        return 'Under granskning';
    }
  };

  const badgeProps = getBadgeVariant(application.status);
  const statusText = getStatusText(application.status);
  const timeAgo = formatDistanceToNow(new Date(application.created_at), { addSuffix: true, locale: sv });

  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-lg">{application.salon_name}</CardTitle>
            <CardDescription className="mt-1">{application.collaboration_title}</CardDescription>
          </div>
          <Badge variant={badgeProps.variant} className={badgeProps.className}>
            {statusText}
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <h4 className="text-sm font-medium text-gray-500 mb-1">Erbjudande</h4>
            <p className="text-sm">{application.deal_title}</p>
          </div>
          
          <div>
            <h4 className="text-sm font-medium text-gray-500 mb-1">Ditt meddelande</h4>
            <p className="text-sm">{application.message}</p>
          </div>
          
          <div className="text-xs text-gray-500">
            Ansökan skickad {timeAgo}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
