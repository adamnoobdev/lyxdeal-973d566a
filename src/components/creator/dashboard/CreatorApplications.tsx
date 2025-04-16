
import { useState, useEffect } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { CollaborationApplication } from "@/types/collaboration";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Loader2, HourglassIcon, CheckCircle2Icon, XCircleIcon } from "lucide-react";
import { format } from "date-fns";

export const CreatorApplications = () => {
  const [applications, setApplications] = useState<CollaborationApplication[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        const { data: userData } = await supabase.auth.getUser();
        
        if (!userData.user) {
          setLoading(false);
          return;
        }

        const { data, error } = await supabase
          .from('collaboration_applications')
          .select(`
            id,
            collaboration_id,
            creator_id,
            status,
            message,
            created_at,
            updated_at,
            collaboration_requests:collaboration_id (
              title, 
              salon_id,
              deal_id,
              salons:salon_id (name),
              deals:deal_id (title)
            )
          `)
          .eq('creator_id', userData.user.id)
          .order('created_at', { ascending: false });

        if (error) throw error;

        // Transform the data to match the CollaborationApplication type
        const transformedData: CollaborationApplication[] = data.map(item => ({
          id: item.id,
          collaboration_id: item.collaboration_id,
          creator_id: item.creator_id,
          status: item.status,
          message: item.message,
          created_at: item.created_at,
          updated_at: item.updated_at,
          collaboration_title: item.collaboration_requests?.title,
          salon_name: item.collaboration_requests?.salons?.name,
          deal_title: item.collaboration_requests?.deals?.title
        }));

        setApplications(transformedData);
      } catch (err) {
        console.error('Error fetching applications:', err);
        setError('Det gick inte att hämta dina ansökningar. Försök igen senare.');
      } finally {
        setLoading(false);
      }
    };

    fetchApplications();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-md">
        <p>{error}</p>
      </div>
    );
  }

  if (applications.length === 0) {
    return (
      <div className="bg-white border border-gray-200 rounded-md p-8 text-center">
        <h3 className="text-lg font-medium mb-2">Du har inga ansökningar ännu</h3>
        <p className="text-gray-500">
          När du ansöker om samarbeten kommer de att visas här.
        </p>
      </div>
    );
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return (
          <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200 flex items-center gap-1">
            <HourglassIcon className="h-3.5 w-3.5" />
            <span>Väntar på svar</span>
          </Badge>
        );
      case 'approved':
        return (
          <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200 flex items-center gap-1">
            <CheckCircle2Icon className="h-3.5 w-3.5" />
            <span>Godkänd</span>
          </Badge>
        );
      case 'rejected':
        return (
          <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200 flex items-center gap-1">
            <XCircleIcon className="h-3.5 w-3.5" />
            <span>Avvisad</span>
          </Badge>
        );
      default:
        return <Badge>{status}</Badge>;
    }
  };

  return (
    <div className="space-y-4">
      {applications.map((application) => (
        <Card key={application.id} className="overflow-hidden">
          <CardHeader className="pb-2">
            <div className="flex justify-between items-start flex-col sm:flex-row gap-2">
              <CardTitle className="text-lg">{application.collaboration_title || 'Samarbete'}</CardTitle>
              {getStatusBadge(application.status)}
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-sm text-muted-foreground mb-3 flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2">
              <span className="font-medium">{application.salon_name || 'Salong'}</span>
              {application.deal_title && (
                <>
                  <span className="hidden sm:inline">•</span>
                  <span>{application.deal_title}</span>
                </>
              )}
            </div>
            
            {application.message && (
              <div className="mb-4">
                <h4 className="text-sm font-medium text-gray-700 mb-1">Ditt meddelande:</h4>
                <p className="text-sm text-gray-600 bg-gray-50 p-3 rounded-md border border-gray-100">
                  {application.message}
                </p>
              </div>
            )}
            
            <div className="text-xs text-gray-500">
              Ansökan skickad: {format(new Date(application.created_at), 'yyyy-MM-dd')}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};
