
import { Tag } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export const EmptyCustomersList = () => {
  return (
    <Card className="bg-white border border-gray-100">
      <CardHeader>
        <CardTitle>Inga kunder ännu</CardTitle>
        <CardDescription>
          När kunder säkrar dina erbjudanden kommer de att visas här
        </CardDescription>
      </CardHeader>
      <CardContent className="flex justify-center py-6">
        <div className="text-center text-muted-foreground">
          <Tag className="mx-auto h-10 w-10 text-muted-foreground/40 mb-3" />
          <p>Inga rabattkoder har använts ännu.</p>
        </div>
      </CardContent>
    </Card>
  );
};
