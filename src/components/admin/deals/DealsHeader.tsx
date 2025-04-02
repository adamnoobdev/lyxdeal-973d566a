
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

interface DealsHeaderProps {
  onCreateClick: () => void;
}

export const DealsHeader = ({ onCreateClick }: DealsHeaderProps) => {
  return (
    <div className="space-y-2">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2">
        <div>
          <h1 className="text-2xl xs:text-3xl font-bold tracking-tight text-primary">Erbjudanden</h1>
          <p className="text-muted-foreground text-sm xs:text-base">
            Hantera och övervaka alla erbjudanden
          </p>
        </div>
        <Button 
          onClick={onCreateClick} 
          className="bg-primary text-white hover:bg-primary/90"
        >
          <Plus className="mr-2 h-4 w-4" />
          Skapa erbjudande
        </Button>
      </div>
    </div>
  );
};
