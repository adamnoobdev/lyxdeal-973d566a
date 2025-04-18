
import { Button } from "@/components/ui/button";
import { Plus, RefreshCw } from "lucide-react";

interface ListHeaderProps {
  onRefresh: () => void;
  onCreateClick: () => void;
}

export function ListHeader({ onRefresh, onCreateClick }: ListHeaderProps) {
  return (
    <div className="flex justify-between items-center mb-6">
      <h2 className="text-xl font-semibold">Samarbetsförfrågningar</h2>
      <div className="flex gap-2">
        <Button 
          variant="outline" 
          size="sm" 
          onClick={onRefresh} 
          className="flex items-center gap-2"
        >
          <RefreshCw className="h-4 w-4" />
          Uppdatera
        </Button>
        <Button onClick={onCreateClick} className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          Skapa förfrågan
        </Button>
      </div>
    </div>
  );
}
