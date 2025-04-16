
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";

interface SalonCollaborationEmptyStateProps {
  onCreateClick: () => void;
}

export function SalonCollaborationEmptyState({ onCreateClick }: SalonCollaborationEmptyStateProps) {
  return (
    <Card>
      <CardContent className="flex flex-col items-center justify-center p-10 text-center">
        <div className="rounded-full bg-primary/10 p-4 mb-4">
          <PlusCircle className="h-8 w-8 text-primary" />
        </div>
        <h3 className="text-lg font-medium mb-2">Inga aktiva samarbeten</h3>
        <p className="text-sm text-muted-foreground mb-6 max-w-md">
          Du har inga pågående samarbeten med kreatörer. Skapa ditt första samarbete för att nå ut till nya potentiella kunder via sociala medier.
        </p>
        <Button onClick={onCreateClick}>Skapa ditt första samarbete</Button>
      </CardContent>
    </Card>
  );
}
