
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";

export const EmptyState = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Hantera prenumeration</CardTitle>
      </CardHeader>
      <CardContent>
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>Ingen aktiv prenumeration hittades.</AlertDescription>
        </Alert>
      </CardContent>
    </Card>
  );
};
