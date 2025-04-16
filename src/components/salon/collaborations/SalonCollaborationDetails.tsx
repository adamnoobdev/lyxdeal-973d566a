
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ActiveCollaboration } from "@/types/collaboration";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Eye, ShoppingBag, ExternalLink, Calendar } from "lucide-react";
import { format } from "date-fns";

interface SalonCollaborationDetailsProps {
  collaboration: ActiveCollaboration;
  onClose: () => void;
  isOpen: boolean;
}

export function SalonCollaborationDetails({
  collaboration,
  onClose,
  isOpen,
}: SalonCollaborationDetailsProps) {
  // Konvertera datumet från ISO-sträng till ett datum
  const startDate = collaboration.created_at 
    ? format(new Date(collaboration.created_at), "yyyy-MM-dd")
    : "Okänt datum";

  // Beräkna konverteringsgrad
  const conversionRate = collaboration.views && collaboration.views > 0
    ? ((collaboration.redemptions || 0) / collaboration.views * 100).toFixed(1)
    : "0.0";

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Samarbetsdetaljer</DialogTitle>
          <DialogDescription>
            Detaljerad information om detta samarbete.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          <div>
            <h3 className="font-medium mb-1">{collaboration.collaboration_title || "Namnlöst samarbete"}</h3>
            <p className="text-sm text-muted-foreground mb-3">
              {collaboration.collaboration_description || "Ingen beskrivning."}
            </p>
            <div className="flex items-center text-sm text-muted-foreground mb-6">
              <Calendar className="h-3.5 w-3.5 mr-1.5" />
              <span>Startad: {startDate}</span>
            </div>
          </div>

          {/* Statistikkort */}
          <div className="grid grid-cols-3 gap-3">
            <Card>
              <CardHeader className="py-2">
                <CardTitle className="text-sm font-medium text-center flex items-center justify-center">
                  <Eye className="h-3.5 w-3.5 mr-1.5" />
                  Visningar
                </CardTitle>
              </CardHeader>
              <CardContent className="py-2 text-center">
                <p className="text-xl font-bold">{collaboration.views || 0}</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="py-2">
                <CardTitle className="text-sm font-medium text-center flex items-center justify-center">
                  <ShoppingBag className="h-3.5 w-3.5 mr-1.5" />
                  Inlösta
                </CardTitle>
              </CardHeader>
              <CardContent className="py-2 text-center">
                <p className="text-xl font-bold">{collaboration.redemptions || 0}</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="py-2">
                <CardTitle className="text-sm font-medium text-center flex items-center justify-center">
                  Konvertering
                </CardTitle>
              </CardHeader>
              <CardContent className="py-2 text-center">
                <p className="text-xl font-bold">{conversionRate}%</p>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-2">
            <h4 className="text-sm font-medium">Erbjudandedetaljer</h4>
            <p className="text-sm">Erbjudande: {collaboration.deal_title || "Okänt erbjudande"}</p>
            <p className="text-sm">Rabattkod: <strong>{collaboration.discount_code}</strong></p>
          </div>

          <div className="space-y-2">
            <h4 className="text-sm font-medium">Kreatörinformation</h4>
            <p className="text-sm">E-post: {collaboration.creator_email || "Okänd"}</p>
            <p className="text-sm">Ersättning: {collaboration.compensation || "Ej specificerat"}</p>
          </div>
        </div>

        <DialogFooter className="gap-2 sm:gap-0">
          <Button variant="secondary" onClick={onClose}>
            Stäng
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
