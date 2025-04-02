
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Card, CardContent } from "@/components/ui/card";
import { Info } from "lucide-react";

export const EmptyState = () => {
  return (
    <Card>
      <CardContent className="pt-6">
        <Alert variant="default">
          <Info className="h-4 w-4" />
          <AlertTitle>Ingen prenumeration hittades</AlertTitle>
          <AlertDescription>
            Vi kunde inte hitta någon aktiv prenumeration för ditt konto. Om du tror att detta är ett fel, kontakta kundtjänst.
          </AlertDescription>
        </Alert>
      </CardContent>
    </Card>
  );
};
