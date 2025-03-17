
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Info, ShoppingBag } from "lucide-react";
import { Link } from "react-router-dom";

export const EmptyPurchasesList = () => {
  return (
    <Card className="bg-white shadow-sm border border-gray-100">
      <CardContent className="flex flex-col items-center py-12 text-center space-y-4">
        <div className="h-16 w-16 bg-gray-50 rounded-full flex items-center justify-center">
          <ShoppingBag className="h-8 w-8 text-gray-400" />
        </div>
        
        <div className="space-y-2 max-w-sm">
          <h3 className="text-lg font-medium">Inga köp hittades</h3>
          <p className="text-sm text-gray-500">
            Det finns inga registrerade köp för dina erbjudanden än. När kunder köper dina erbjudanden kommer de att visas här.
          </p>
        </div>

        <div className="bg-blue-50 p-3 rounded-md border border-blue-100 flex items-start mt-4 max-w-sm w-full">
          <Info className="h-5 w-5 text-blue-500 mt-0.5 mr-2 shrink-0" />
          <div className="text-sm text-left text-blue-700">
            När ett köp görs registreras kundens e-post, rabattkod och köpdatum automatiskt. Du behöver inte göra något manuellt.
          </div>
        </div>
        
        <Button asChild variant="outline" className="mt-4">
          <Link to="/salon/deals">
            Hantera dina erbjudanden
          </Link>
        </Button>
      </CardContent>
    </Card>
  );
};
