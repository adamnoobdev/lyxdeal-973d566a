
import { useState } from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { CollaborationRequest } from "@/types/collaboration";
import { formatDistance } from "date-fns";
import { sv } from "date-fns/locale";
import { Users, Scissors, CalendarClock } from "lucide-react";

interface OpportunityCardProps {
  opportunity: CollaborationRequest;
  onApply: (opportunity: CollaborationRequest, message: string) => Promise<void>;
}

export const OpportunityCard = ({ opportunity, onApply }: OpportunityCardProps) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleApplyClick = () => {
    setIsDialogOpen(true);
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    await onApply(opportunity, message);
    setIsSubmitting(false);
    setIsDialogOpen(false);
  };

  const availableSpots = opportunity.max_creators - opportunity.current_creators;
  const createdDate = new Date(opportunity.created_at);
  const timeAgo = formatDistance(createdDate, new Date(), { addSuffix: true, locale: sv });
  
  return (
    <>
      <Card className="h-full flex flex-col">
        <CardHeader>
          <div className="flex justify-between items-start">
            <CardTitle className="text-lg">{opportunity.title}</CardTitle>
            <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
              {availableSpots} {availableSpots === 1 ? 'plats' : 'platser'}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="flex-grow">
          <div className="flex items-center text-sm text-muted-foreground mb-4">
            <Scissors className="h-4 w-4 mr-1" />
            <span>{opportunity.salon_name}</span>
            <span className="mx-1">•</span>
            <span>{opportunity.deal_title}</span>
          </div>
          <p className="text-sm text-gray-600 mb-4">{opportunity.description}</p>
          <div className="space-y-2">
            <div className="flex items-center text-sm">
              <CalendarClock className="h-4 w-4 mr-1.5 text-muted-foreground" />
              <span>Publicerad {timeAgo}</span>
            </div>
            <div className="flex items-center text-sm">
              <Users className="h-4 w-4 mr-1.5 text-muted-foreground" />
              <span>
                {opportunity.current_creators} av {opportunity.max_creators} kreatörer
              </span>
            </div>
          </div>
          
          <div className="mt-4 py-2 px-3 bg-purple-50 border-l-4 border-purple-500 rounded-sm">
            <p className="text-sm font-medium text-purple-800">Ersättning</p>
            <p className="text-sm text-purple-700">{opportunity.compensation}</p>
          </div>
        </CardContent>
        <CardFooter>
          <Button 
            onClick={handleApplyClick} 
            className="w-full"
          >
            Ansök nu
          </Button>
        </CardFooter>
      </Card>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Ansök till samarbete: {opportunity.title}</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <p className="text-sm mb-4">
              Berätta varför du är intresserad av detta samarbete och varför du skulle vara en bra match för {opportunity.salon_name}.
            </p>
            <Textarea
              placeholder="Skriv ditt meddelande här..."
              className="min-h-[120px]"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
            />
          </div>
          <DialogFooter>
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => setIsDialogOpen(false)}
              disabled={isSubmitting}
            >
              Avbryt
            </Button>
            <Button 
              type="button" 
              onClick={handleSubmit}
              disabled={isSubmitting || !message.trim()}
            >
              {isSubmitting ? "Skickar..." : "Skicka ansökan"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};
