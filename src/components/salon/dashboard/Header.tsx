
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

interface HeaderProps {
  onCreateClick: () => void;
}

export const DashboardHeader = ({ onCreateClick }: HeaderProps) => {
  return (
    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
      <h1 className="text-3xl font-bold">Salong Dashboard</h1>
      <Button onClick={onCreateClick}>
        <Plus className="mr-2 h-4 w-4" />
        Skapa erbjudande
      </Button>
    </div>
  );
};
