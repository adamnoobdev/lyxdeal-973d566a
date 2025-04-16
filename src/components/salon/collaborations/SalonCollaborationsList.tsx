
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Eye, ShoppingBag, ExternalLink, MoreHorizontal } from "lucide-react";
import { useState } from "react";
import { ActiveCollaboration } from "@/types/collaboration";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { SalonCollaborationDetails } from "./SalonCollaborationDetails";

interface SalonCollaborationsListProps {
  collaborations: ActiveCollaboration[];
  salonId: number | undefined;
}

export function SalonCollaborationsList({ collaborations, salonId }: SalonCollaborationsListProps) {
  const [selectedCollaboration, setSelectedCollaboration] = useState<ActiveCollaboration | null>(null);

  // Sortera samarbeten så att de med flest inlösningar visas först
  const sortedCollaborations = [...collaborations].sort(
    (a, b) => (b.redemptions || 0) - (a.redemptions || 0)
  );

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Aktiva samarbeten</CardTitle>
        </CardHeader>
        <CardContent className="space-y-5">
          {sortedCollaborations.length === 0 ? (
            <p className="text-center text-muted-foreground py-6">
              Inga aktiva samarbeten hittades.
            </p>
          ) : (
            <div className="divide-y">
              {sortedCollaborations.map((collaboration) => (
                <div key={collaboration.id} className="flex items-center justify-between py-4">
                  <div className="flex items-start gap-3">
                    <div className="hidden sm:block h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                      {collaboration.creator_email?.substring(0, 2).toUpperCase()}
                    </div>
                    <div>
                      <h4 className="font-medium text-sm">{collaboration.collaboration_title || "Namnlöst samarbete"}</h4>
                      <p className="text-muted-foreground text-xs">
                        Erbjudande: {collaboration.deal_title || "Okänt erbjudande"}
                      </p>
                      <p className="text-muted-foreground text-xs">
                        Rabattkod: {collaboration.discount_code}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-6">
                    <div className="hidden md:flex items-center gap-1.5">
                      <Eye className="h-3.5 w-3.5 text-muted-foreground" />
                      <span className="text-sm">
                        {collaboration.views || 0}
                      </span>
                    </div>
                    
                    <div className="hidden md:flex items-center gap-1.5">
                      <ShoppingBag className="h-3.5 w-3.5 text-muted-foreground" />
                      <span className="text-sm">
                        {collaboration.redemptions || 0}
                      </span>
                    </div>
                    
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <MoreHorizontal className="h-4 w-4" />
                          <span className="sr-only">Åtgärder</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => setSelectedCollaboration(collaboration)}>
                          <ExternalLink className="mr-2 h-4 w-4" />
                          <span>Visa detaljer</span>
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
      
      {selectedCollaboration && (
        <SalonCollaborationDetails
          collaboration={selectedCollaboration}
          onClose={() => setSelectedCollaboration(null)}
          isOpen={!!selectedCollaboration}
        />
      )}
    </>
  );
}
