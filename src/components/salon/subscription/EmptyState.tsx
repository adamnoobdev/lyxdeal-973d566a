
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Card, CardContent } from "@/components/ui/card";
import { Info } from "lucide-react";

export const EmptyState = () => {
  return (
    <Card className="border border-muted-200">
      <CardContent className="p-6">
        <Alert variant="default" className="bg-blue-50 border-blue-200 shadow-sm">
          <Info className="h-5 w-5 text-blue-600" />
          <AlertTitle className="text-blue-800 text-base font-medium mb-1">Ingen prenumeration hittades</AlertTitle>
          <AlertDescription className="text-blue-700 text-sm">
            Vi kunde inte hitta någon aktiv prenumeration för ditt konto. Om du tror att detta är ett fel, kontakta kundtjänst.
          </AlertDescription>
        </Alert>
      </CardContent>
    </Card>
  );
};
