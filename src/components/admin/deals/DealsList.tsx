
import { DealsListContainer } from "./DealsListContainer";
import { Card, CardContent } from "@/components/ui/card";

export const DealsList = () => {
  return (
    <Card className="border border-secondary/20">
      <CardContent className="p-0 xs:p-2 sm:p-6">
        <DealsListContainer />
      </CardContent>
    </Card>
  );
};
