
import { Table, TableHead, TableHeader, TableRow, TableBody } from "@/components/ui/table";
import { SortableTableHead } from "./SortableTableHead";
import { CollaborationTableBody } from "./CollaborationTableBody";
import { ActiveCollaboration } from "@/types/collaboration";

// Define the SortConfig interface
interface SortConfig {
  key: string;
  direction: 'asc' | 'desc';
}

interface CollaborationTableProps {
  collaborations: ActiveCollaboration[];
  searchTerm: string;
  sortConfig: SortConfig;
  onSort: (key: string) => void;
}

export function CollaborationTable({ 
  collaborations, 
  searchTerm,
  sortConfig,
  onSort
}: CollaborationTableProps) {
  // Kontrollera att collaborations är en array
  if (!Array.isArray(collaborations)) {
    console.error('Felaktigt dataformat: collaborations är inte en array:', collaborations);
    collaborations = [];
  }

  console.log('CollaborationTable rendered with', collaborations.length, 'collaborations');

  // Förbättrad sortering med felhantering
  const sortedCollaborations = [...collaborations].sort((a, b) => {
    try {
      // Hantera null/undefined värden
      if (!a || !a[sortConfig.key as keyof ActiveCollaboration]) return sortConfig.direction === 'asc' ? -1 : 1;
      if (!b || !b[sortConfig.key as keyof ActiveCollaboration]) return sortConfig.direction === 'asc' ? 1 : -1;
      
      // Numerisk sortering för views och redemptions
      if (sortConfig.key === 'views' || sortConfig.key === 'redemptions') {
        const aValue = typeof a[sortConfig.key as keyof ActiveCollaboration] === 'number' 
          ? Number(a[sortConfig.key as keyof ActiveCollaboration]) 
          : 0;
        
        const bValue = typeof b[sortConfig.key as keyof ActiveCollaboration] === 'number' 
          ? Number(b[sortConfig.key as keyof ActiveCollaboration]) 
          : 0;
          
        return sortConfig.direction === 'asc' ? aValue - bValue : bValue - aValue;
      }
      
      // Standardsortering (sträng eller datum)
      const aValue = String(a[sortConfig.key as keyof ActiveCollaboration] || '');
      const bValue = String(b[sortConfig.key as keyof ActiveCollaboration] || '');
      
      if (sortConfig.direction === 'asc') {
        return aValue.localeCompare(bValue);
      } else {
        return bValue.localeCompare(aValue);
      }
    } catch (err) {
      console.error('Sorteringsfel:', err, 'för objekten:', a, b);
      return 0; // Returnera 0 vid fel för att behålla ursprunglig ordning
    }
  });

  return (
    <div className="rounded-md border overflow-hidden">
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <SortableTableHead
                label="Rabattkod"
                sortKey="discount_code"
                currentSortKey={sortConfig.key}
                sortDirection={sortConfig.direction}
                onSort={onSort}
              />
              <SortableTableHead
                label="Skapad"
                sortKey="created_at"
                currentSortKey={sortConfig.key}
                sortDirection={sortConfig.direction}
                onSort={onSort}
                className="hidden sm:table-cell"
              />
              <SortableTableHead
                label="Visningar"
                sortKey="views"
                currentSortKey={sortConfig.key}
                sortDirection={sortConfig.direction}
                onSort={onSort}
                centerContent
                className="text-center"
              />
              <SortableTableHead
                label="Inlösta"
                sortKey="redemptions"
                currentSortKey={sortConfig.key}
                sortDirection={sortConfig.direction}
                onSort={onSort}
                centerContent
                className="text-center"
              />
              <TableHead className="text-center">Konvertering</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <CollaborationTableBody 
              collaborations={sortedCollaborations} 
              searchTerm={searchTerm}
            />
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
