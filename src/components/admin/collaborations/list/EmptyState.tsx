
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Users } from "lucide-react";

interface EmptyStateProps {
  onCreateClick: () => void;
}

export function EmptyState({ onCreateClick }: EmptyStateProps) {
  return (
    <Card className="bg-gray-50">
      <CardContent className="pt-6 text-center">
        <Users className="h-12 w-12 text-gray-400 mx-auto mb-3" />
        <h3 className="font-medium text-lg mb-1">Inga samarbetsförfrågningar</h3>
        <p className="text-muted-foreground mb-4">
          Skapa en ny samarbetsförfrågan för att börja
        </p>
        <Button onClick={onCreateClick} className="mx-auto flex items-center gap-2">
          <Plus className="h-4 w-4" />
          Skapa förfrågan
        </Button>
      </CardContent>
    </Card>
  );
}
