
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Card, CardContent } from "@/components/ui/card";
import { AlertOctagon } from "lucide-react";

interface ErrorStateProps {
  error: string;
}

export const ErrorState = ({ error }: ErrorStateProps) => {
  return (
    <Card className="border border-muted-200">
      <CardContent className="p-6">
        <Alert variant="destructive" className="bg-destructive-50 border-destructive-200 shadow-sm">
          <AlertOctagon className="h-5 w-5 text-destructive" />
          <AlertTitle className="text-destructive-800 text-base font-medium mb-1">Ett fel uppstod</AlertTitle>
          <AlertDescription className="text-destructive-700 text-sm">
            {error || "Det gick inte att hämta information om din prenumeration."}
          </AlertDescription>
        </Alert>
      </CardContent>
    </Card>
  );
};
