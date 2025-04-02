
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Card, CardContent } from "@/components/ui/card";
import { AlertOctagon } from "lucide-react";

interface ErrorStateProps {
  error: string;
}

export const ErrorState = ({ error }: ErrorStateProps) => {
  return (
    <Card>
      <CardContent className="pt-6">
        <Alert variant="destructive">
          <AlertOctagon className="h-4 w-4" />
          <AlertTitle>Ett fel uppstod</AlertTitle>
          <AlertDescription>
            {error || "Det gick inte att hämta information om din prenumeration."}
          </AlertDescription>
        </Alert>
      </CardContent>
    </Card>
  );
};
