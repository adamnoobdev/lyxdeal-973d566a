
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

interface DealsHeaderProps {
  onCreateClick: () => void;
}

export const DealsHeader = ({ onCreateClick }: DealsHeaderProps) => {
  return (
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Erbjudanden</h1>
        <p className="text-muted-foreground mt-1">Hantera och övervaka alla erbjudanden</p>
      </div>
      <Button onClick={onCreateClick} className="w-full sm:w-auto">
        <Plus className="h-4 w-4 mr-2" />
        Skapa erbjudande
      </Button>
    </div>
  );
};
