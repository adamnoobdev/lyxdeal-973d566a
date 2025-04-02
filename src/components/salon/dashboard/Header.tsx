
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

interface HeaderProps {
  onCreateClick: () => void;
}

export const DashboardHeader = ({ onCreateClick }: HeaderProps) => {
  return (
    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-4 sm:mb-6">
      <h1 className="text-2xl sm:text-3xl font-bold">Salong Dashboard</h1>
      <Button onClick={onCreateClick} className="w-full sm:w-auto">
        <Plus className="mr-2 h-4 w-4" />
        Skapa erbjudande
      </Button>
    </div>
  );
};
