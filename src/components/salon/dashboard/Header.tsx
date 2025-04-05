
import { Button } from "@/components/ui/button";

interface DashboardHeaderProps {
  onCreateClick: () => void;
}

export const DashboardHeader = ({ onCreateClick }: DashboardHeaderProps) => {
  return (
    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
      <h1 className="text-2xl sm:text-3xl font-bold text-primary">Översikt</h1>
      <Button 
        onClick={onCreateClick}
        variant="default"
        className="bg-primary text-white hover:bg-primary/90"
      >
        Skapa erbjudande
      </Button>
    </div>
  );
};
