
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

interface SalonsHeaderProps {
  onCreateClick: () => void;
}

export const SalonsHeader = ({ onCreateClick }: SalonsHeaderProps) => {
  return (
    <div className="space-y-2">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2">
        <div>
          <h1 className="text-2xl xs:text-3xl font-bold tracking-tight text-primary">Salonger</h1>
          <p className="text-muted-foreground text-sm xs:text-base">
            Hantera salonger och deras konton
          </p>
        </div>
        <Button 
          onClick={onCreateClick} 
          className="bg-primary text-white hover:bg-primary/90"
        >
          <Plus className="mr-2 h-4 w-4" />
          Ny salong
        </Button>
      </div>
    </div>
  );
};
