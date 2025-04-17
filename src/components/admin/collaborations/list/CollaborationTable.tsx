
import { Table, TableHead, TableHeader, TableRow, TableBody } from "@/components/ui/table";
import { SortableTableHead } from "./SortableTableHead";
import { CollaborationTableBody } from "./CollaborationTableBody";

interface CollaborationTableProps {
  collaborations: any[];
  searchTerm: string;
  sortConfig: {
    key: string;
    direction: 'asc' | 'desc';
  };
  onSort: (key: string) => void;
}

export function CollaborationTable({ 
  collaborations, 
  searchTerm,
  sortConfig,
  onSort
}: CollaborationTableProps) {
  const sortedCollaborations = [...collaborations].sort((a, b) => {
    // Handle null values
    if (a[sortConfig.key] === null) return sortConfig.direction === 'asc' ? -1 : 1;
    if (b[sortConfig.key] === null) return sortConfig.direction === 'asc' ? 1 : -1;
    
    // Numeric sort for views and redemptions
    if (sortConfig.key === 'views' || sortConfig.key === 'redemptions') {
      return sortConfig.direction === 'asc' 
        ? (a[sortConfig.key] || 0) - (b[sortConfig.key] || 0) 
        : (b[sortConfig.key] || 0) - (a[sortConfig.key] || 0);
    }
    
    // Default sort (string or date)
    if (sortConfig.direction === 'asc') {
      return a[sortConfig.key] < b[sortConfig.key] ? -1 : 1;
    } else {
      return a[sortConfig.key] > b[sortConfig.key] ? -1 : 1;
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
