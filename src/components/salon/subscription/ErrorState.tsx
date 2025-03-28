
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";

interface ErrorStateProps {
  error: string;
}

export const ErrorState = ({ error }: ErrorStateProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Hantera prenumeration</CardTitle>
      </CardHeader>
      <CardContent>
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      </CardContent>
    </Card>
  );
};
