
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

interface DealsHeaderProps {
  onCreateClick: () => void;
}

export const DealsHeader = ({ onCreateClick }: DealsHeaderProps) => {
  return (
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-10 bg-gradient-to-r from-primary/5 to-primary/10 p-6 rounded-xl">
      <div>
        <h1 className="text-3xl font-bold text-primary mb-2">Erbjudanden</h1>
        <p className="text-gray-600 font-medium">
          Hantera och övervaka alla erbjudanden
        </p>
      </div>
      <Button 
        onClick={onCreateClick} 
        size="lg" 
        className="w-full sm:w-auto mt-4 sm:mt-0 bg-primary hover:bg-primary/90 transition-all shadow-md"
      >
        <Plus className="h-5 w-5 mr-2" />
        Skapa erbjudande
      </Button>
    </div>
  );
};
