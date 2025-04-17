
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CollaborationSearchBar } from "./list/CollaborationSearchBar";
import { ExportButton } from "./list/ExportButton";
import { CollaborationTable } from "./list/CollaborationTable";
import { useCsvExport } from "./list/useCsvExport";

// Define the type for the sort configuration
interface SortConfig {
  key: string;
  direction: 'asc' | 'desc';
}

export function ActiveCollaborationsList({ collaborations }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortConfig, setSortConfig] = useState<SortConfig>({
    key: 'created_at',
    direction: 'desc'
  });

  const { exportToCsv } = useCsvExport(collaborations);
  
  // Handle sort
  const handleSort = (key) => {
    setSortConfig(prevConfig => ({
      key,
      direction: prevConfig.key === key && prevConfig.direction === 'asc' ? 'desc' : 'asc'
    }));
  };

  // Handler for search term changes
  const handleSearchChange = (value: string) => {
    setSearchTerm(value);
  };
  
  // Calculate how many collaborations match the current search
  const filteredCount = collaborations.filter(collab => {
    const searchLower = searchTerm.toLowerCase();
    return (
      (collab.discount_code && collab.discount_code.toLowerCase().includes(searchLower)) ||
      (collab.id && collab.id.toString().toLowerCase().includes(searchLower))
    );
  }).length;

  // Lägg till loggning för att hjälpa till med debugging
  console.log('ActiveCollaborationsList rendering with:', { 
    collaborationsCount: collaborations.length,
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
          collaborations={collaborations}
          searchTerm={searchTerm}
          sortConfig={sortConfig}
          onSort={handleSort}
        />
        <div className="text-xs text-muted-foreground mt-4 text-center">
          Visar {filteredCount} av totalt {collaborations.length} samarbeten
        </div>
      </CardContent>
    </Card>
  );
}
