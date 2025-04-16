
import { useState, useEffect } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { ActiveCollaboration } from "@/types/collaboration";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Loader2, Eye, ShoppingBag, Copy, ExternalLink } from "lucide-react";
import { format } from "date-fns";

export const CreatorActiveCollaborations = () => {
  const [collaborations, setCollaborations] = useState<ActiveCollaboration[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCollaborations = async () => {
      try {
        const { data: userData } = await supabase.auth.getUser();
        
        if (!userData.user) {
          setLoading(false);
          return;
        }

        const { data, error } = await supabase
          .from('active_collaborations')
          .select(`
            id,
            collaboration_id,
            creator_id,
            salon_id,
            deal_id,
            discount_code,
            created_at,
            views,
            redemptions,
            salons:salon_id (name),
            deals:deal_id (title, description, booking_url)
          `)
          .eq('creator_id', userData.user.id)
          .order('created_at', { ascending: false });

        if (error) throw error;

        // Transform the data to match the ActiveCollaboration type
        const transformedData: ActiveCollaboration[] = data.map(item => ({
          id: item.id,
          collaboration_id: item.collaboration_id,
          creator_id: item.creator_id,
          salon_id: item.salon_id,
          deal_id: item.deal_id,
          discount_code: item.discount_code,
          created_at: item.created_at,
          redemptions: item.redemptions || 0,
          views: item.views || 0,
          salon_name: item.salons?.name,
          deal_title: item.deals?.title,
          booking_url: item.deals?.booking_url
        }));

        setCollaborations(transformedData);
      } catch (err) {
        console.error('Error fetching active collaborations:', err);
        setError('Det gick inte att hämta dina aktiva samarbeten. Försök igen senare.');
      } finally {
        setLoading(false);
      }
    };

    fetchCollaborations();
  }, []);

  const copyDiscountCode = (code: string) => {
    navigator.clipboard.writeText(code);
    toast.success('Rabattkod kopierad!');
  };

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

  if (collaborations.length === 0) {
    return (
      <div className="bg-white border border-gray-200 rounded-md p-8 text-center">
        <h3 className="text-lg font-medium mb-2">Du har inga aktiva samarbeten</h3>
        <p className="text-gray-500">
          När dina samarbetsansökningar blir godkända kommer de att visas här.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {collaborations.map((collab) => (
        <Card key={collab.id} className="overflow-hidden">
          <CardHeader className="bg-gray-50 border-b pb-4">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-medium">{collab.deal_title}</h3>
                <p className="text-sm text-muted-foreground">{collab.salon_name}</p>
              </div>
              <div className="text-right text-xs text-gray-500">
                Aktivt sedan {format(new Date(collab.created_at), 'yyyy-MM-dd')}
              </div>
            </div>
          </CardHeader>
          <CardContent className="pt-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div className="flex flex-col space-y-1">
                <span className="text-xs text-muted-foreground">Din rabattkod</span>
                <div className="flex items-center gap-2">
                  <code className="bg-purple-50 text-purple-800 px-3 py-1.5 rounded-md font-mono text-sm flex-grow flex items-center justify-between">
                    {collab.discount_code}
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={() => copyDiscountCode(collab.discount_code)}
                      className="h-6 w-6 p-0 text-purple-700"
                    >
                      <Copy className="h-3.5 w-3.5" />
                      <span className="sr-only">Kopiera kod</span>
                    </Button>
                  </code>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-gray-50 p-3 rounded-md text-center">
                  <div className="flex items-center justify-center mb-1 text-purple-600">
                    <Eye className="h-4 w-4 mr-1" />
                    <span className="font-medium">{collab.views}</span>
                  </div>
                  <div className="text-xs text-gray-600">Visningar</div>
                </div>
                <div className="bg-gray-50 p-3 rounded-md text-center">
                  <div className="flex items-center justify-center mb-1 text-teal-600">
                    <ShoppingBag className="h-4 w-4 mr-1" />
                    <span className="font-medium">{collab.redemptions}</span>
                  </div>
                  <div className="text-xs text-gray-600">Inlösningar</div>
                </div>
              </div>
            </div>
            
            {collab.booking_url && (
              <Button
                variant="outline"
                size="sm"
                className="w-full mt-2"
                onClick={() => window.open(collab.booking_url, '_blank')}
              >
                <ExternalLink className="h-4 w-4 mr-1" />
                Gå till bokningssidan
              </Button>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );
};
