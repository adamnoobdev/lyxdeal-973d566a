
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CollaborationSearchBar } from "./list/CollaborationSearchBar";
import { ExportButton } from "./list/ExportButton";
import { CollaborationTable } from "./list/CollaborationTable";
import { useCsvExport } from "./list/useCsvExport";
import { ActiveCollaboration } from "@/types/collaboration";

// Define the type for the sort configuration
interface SortConfig {
  key: string;
  direction: 'asc' | 'desc';
}

interface ActiveCollaborationsListProps {
  collaborations: ActiveCollaboration[];
}

export function ActiveCollaborationsList({ collaborations }: ActiveCollaborationsListProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortConfig, setSortConfig] = useState<SortConfig>({
    key: 'created_at',
    direction: 'desc'
  });

  const { exportToCsv } = useCsvExport(collaborations);
  
  // Handle sort
  const handleSort = (key: string) => {
    setSortConfig(prevConfig => ({
      key,
      direction: prevConfig.key === key && prevConfig.direction === 'asc' ? 'desc' : 'asc'
    }));
  };

  // Handler for search term changes
  const handleSearchChange = (value: string) => {
    setSearchTerm(value);
  };
  
  // Säkerställ att collaborations är en array
  const safeCollaborations = Array.isArray(collaborations) ? collaborations : [];
  
  // Calculate how many collaborations match the current search
  const filteredCount = safeCollaborations.filter(collab => {
    if (!collab) return false;
    
    const searchLower = searchTerm.toLowerCase();
    return (
      (collab.discount_code && collab.discount_code.toLowerCase().includes(searchLower)) ||
      (collab.id && collab.id.toString().toLowerCase().includes(searchLower))
    );
  }).length;

  // Utökad loggning för felsökning
  console.log('ActiveCollaborationsList rendering with:', { 
    collaborationsCount: safeCollaborations.length,
    firstCollaboration: safeCollaborations[0] ? JSON.stringify(safeCollaborations[0]) : 'none',
    searchTerm,
    sortConfig,
    filteredCount
  });

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <CardTitle>Aktiva samarbeten</CardTitle>
          <div className="flex flex-col sm:flex-row gap-2 items-start sm:items-center">
            <CollaborationSearchBar 
              searchTerm={searchTerm} 
              onSearchChange={handleSearchChange} 
            />
            <ExportButton onExport={exportToCsv} />
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <CollaborationTable 
          collaborations={safeCollaborations}
          searchTerm={searchTerm}
          sortConfig={sortConfig}
          onSort={handleSort}
        />
        <div className="text-xs text-muted-foreground mt-4 text-center">
          Visar {filteredCount} av totalt {safeCollaborations.length} samarbeten
        </div>
      </CardContent>
    </Card>
  );
}
