
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { CollaborationTable } from "./list/CollaborationTable";
import { ActiveCollaboration } from "@/types/collaboration";

interface ActiveCollaborationsListProps {
  collaborations: ActiveCollaboration[];
  isLoading: boolean;
}

export const ActiveCollaborationsList = ({ 
  collaborations,
  isLoading
}: ActiveCollaborationsListProps) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortConfig, setSortConfig] = useState({
    key: 'created_at',
    direction: 'desc' as 'asc' | 'desc'
  });

  const handleSort = (key: string) => {
    setSortConfig(current => ({
      key,
      direction: current.key === key && current.direction === 'asc' ? 'desc' : 'asc'
    }));
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div className="relative w-full sm:w-64">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Sök rabattkod"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-8 w-full"
            disabled={isLoading}
          />
        </div>
      </div>
      
      <CollaborationTable
        collaborations={collaborations}
        searchTerm={searchTerm}
        sortConfig={sortConfig}
        onSort={handleSort}
      />
    </div>
  );
};
