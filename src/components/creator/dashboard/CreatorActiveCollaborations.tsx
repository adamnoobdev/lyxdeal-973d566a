
import { useState, useEffect } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { ActiveCollaboration } from "@/types/collaboration";
import { CollaborationCard } from "@/components/creator/dashboard/CollaborationCard";
import { Loader2, ExternalLink, Share2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { toast } from "sonner";

export const CreatorActiveCollaborations = () => {
  const [collaborations, setCollaborations] = useState<ActiveCollaboration[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCollaborations = async () => {
      try {
        const { data: authData } = await supabase.auth.getUser();
        if (!authData.user) throw new Error('Ej inloggad');

        // Hämta användarens aktiva samarbeten
        const { data, error } = await supabase
          .from('active_collaborations')
          .select(`
            id,
            collaboration_id,
            creator_id,
            salon_id,
            deal_id,
            discount_code,
            views,
            redemptions,
            created_at,
            collaboration_requests:collaboration_id (
              title,
              description,
              compensation
            ),
            salons:salon_id (
              name,
              website
            ),
            deals:deal_id (
              title,
              description,
              booking_url
            )
          `)
          .eq('creator_id', authData.user.id)
          .order('created_at', { ascending: false });

        if (error) throw error;

        // Transformera datan till rätt format
        const transformedData: ActiveCollaboration[] = data.map(item => ({
          id: item.id,
          collaboration_id: item.collaboration_id,
          creator_id: item.creator_id,
          salon_id: item.salon_id,
          deal_id: item.deal_id,
          discount_code: item.discount_code,
          views: item.views,
          redemptions: item.redemptions,
          created_at: item.created_at,
          collaboration_title: item.collaboration_requests?.title,
          collaboration_description: item.collaboration_requests?.description,
          compensation: item.collaboration_requests?.compensation,
          salon_name: item.salons?.name,
          salon_website: item.salons?.website,
          deal_title: item.deals?.title,
          deal_description: item.deals?.description,
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

  const shareCollaboration = async (collaboration: ActiveCollaboration) => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `${collaboration.deal_title} - rabattkod`,
          text: `Kolla in det här erbjudandet från ${collaboration.salon_name}! Använd min rabattkod: ${collaboration.discount_code}`,
          url: collaboration.booking_url || window.location.origin,
        });
        
        // Registrera delning
        await supabase
          .from('collaboration_shares')
          .insert([{
            collaboration_id: collaboration.id,
            creator_id: collaboration.creator_id,
            platform: 'share_api'
          }]);
          
      } catch (err) {
        console.error('Error sharing:', err);
      }
    } else {
      // Fallback om navigator.share inte finns
      try {
        await navigator.clipboard.writeText(
          `Kolla in det här erbjudandet från ${collaboration.salon_name}! Använd min rabattkod: ${collaboration.discount_code}${collaboration.booking_url ? '\n' + collaboration.booking_url : ''}`
        );
        toast.success('Rabattkod kopierad till urklipp!');
      } catch (err) {
        console.error('Kunde inte kopiera:', err);
        toast.error('Kunde inte kopiera koden');
      }
    }
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
          När dina ansökningar blir godkända kommer dina aktiva samarbeten att visas här.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {collaborations.map((collaboration) => (
        <Card key={collaboration.id} className="overflow-hidden">
          <CardHeader className="pb-2">
            <div className="flex justify-between items-start">
              <div>
                <CardTitle className="text-lg">{collaboration.salon_name}</CardTitle>
                <CardDescription className="mt-1">{collaboration.deal_title}</CardDescription>
              </div>
              <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                Aktivt
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="pb-2">
            <div className="mb-4">
              <h4 className="text-sm font-semibold mb-1">Din rabattkod</h4>
              <div className="bg-gray-50 p-2 rounded-md border border-gray-200 font-mono text-center">
                {collaboration.discount_code}
              </div>
            </div>
            <div className="flex justify-between text-sm text-gray-500 mb-4">
              <div>
                <p className="font-medium">Visningar</p>
                <p className="text-lg font-semibold text-gray-700">{collaboration.views}</p>
              </div>
              <div>
                <p className="font-medium">Inlösta</p>
                <p className="text-lg font-semibold text-gray-700">{collaboration.redemptions}</p>
              </div>
              <div>
                <p className="font-medium">Ersättning</p>
                <p className="text-lg font-semibold text-gray-700">{collaboration.compensation}</p>
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex gap-2">
            {collaboration.booking_url && (
              <Button variant="outline" size="sm" className="flex-1" asChild>
                <a href={collaboration.booking_url} target="_blank" rel="noreferrer">
                  <ExternalLink className="h-4 w-4 mr-1" /> Besök länk
                </a>
              </Button>
            )}
            <Button variant="default" size="sm" className="flex-1" onClick={() => shareCollaboration(collaboration)}>
              <Share2 className="h-4 w-4 mr-1" /> Dela
            </Button>
          </CardFooter>
        </Card>
      ))}
    </div>
  );
};
