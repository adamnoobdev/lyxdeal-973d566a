
import { ActiveCollaboration } from "@/types/collaboration";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ExternalLink, Share2 } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

interface CollaborationCardProps {
  collaboration: ActiveCollaboration;
}

export const CollaborationCard = ({ collaboration }: CollaborationCardProps) => {
  const shareCollaboration = async () => {
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

  return (
    <Card className="overflow-hidden">
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
        <Button variant="default" size="sm" className="flex-1" onClick={shareCollaboration}>
          <Share2 className="h-4 w-4 mr-1" /> Dela
        </Button>
      </CardFooter>
    </Card>
  );
};
