
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

interface DealsHeaderProps {
  onCreateClick: () => void;
}

export const DealsHeader = ({ onCreateClick }: DealsHeaderProps) => {
  return (
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 sm:mb-6">
      <div>
        <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-primary mb-1">Erbjudanden</h1>
        <p className="text-xs sm:text-sm md:text-base text-muted-foreground">
          Hantera och övervaka alla erbjudanden
        </p>
      </div>
      <Button 
        onClick={onCreateClick} 
        size="sm" 
        className="w-full sm:w-auto mt-3 sm:mt-0 bg-primary hover:bg-primary/90 text-sm"
      >
        <Plus className="h-4 w-4 mr-1 sm:mr-2" />
        Skapa erbjudande
      </Button>
    </div>
  );
};
