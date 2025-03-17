
import { Package } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export const EmptyPurchasesList = () => {
  return (
    <Card className="bg-white border border-gray-100">
      <CardHeader>
        <CardTitle>Inga köp ännu</CardTitle>
        <CardDescription>
          När kunder gör ett köp kommer de att visas här
        </CardDescription>
      </CardHeader>
      <CardContent className="flex justify-center py-6">
        <div className="text-center text-muted-foreground">
          <Package className="mx-auto h-10 w-10 text-muted-foreground/40 mb-3" />
          <p>Inga köp har gjorts ännu.</p>
        </div>
      </CardContent>
    </Card>
  );
};
