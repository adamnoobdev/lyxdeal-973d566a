
import { memo } from "react";
import { CityDealsSection } from "./CityDealsSection";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Info } from "lucide-react";

interface DealsSectionProps {
  selectedCategory: string;
  selectedCity: string;
}

const DealsSectionComponent = ({
  selectedCategory,
  selectedCity
}: DealsSectionProps) => {
  return (
    <div className="space-y-6">
      <Alert variant="default" className="bg-primary/5 border border-primary/20 mb-4 max-w-4xl mx-auto">
        <Info className="h-4 w-4 text-primary" />
        <AlertDescription>
          Lyxdeal erbjuder exklusiva skönhetserbjudanden endast i Sverige. Vi utökar vårt utbud av städer kontinuerligt.
        </AlertDescription>
      </Alert>
      
      <CityDealsSection selectedCategory={selectedCategory} selectedCity={selectedCity} />
    </div>
  );
};

export const DealsSection = memo(DealsSectionComponent);
