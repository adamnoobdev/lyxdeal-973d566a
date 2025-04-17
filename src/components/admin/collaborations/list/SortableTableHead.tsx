
import { ArrowUpDown } from "lucide-react";
import { TableHead } from "@/components/ui/table";

interface SortableTableHeadProps {
  label: string;
  sortKey: string;
  currentSortKey: string;
  sortDirection: 'asc' | 'desc';  // Updated to be more specific
  onSort: (key: string) => void;
  className?: string;
  centerContent?: boolean;
}

export function SortableTableHead({
  label,
  sortKey,
  currentSortKey,
  sortDirection,
  onSort,
  className = "",
  centerContent = false
}: SortableTableHeadProps) {
  const isActive = currentSortKey === sortKey;

  const renderIcon = () => {
    if (isActive) {
      return (
        <ArrowUpDown className={`ml-1 h-4 w-4 ${sortDirection === 'asc' ? 'rotate-180' : ''}`} />
      );
    }
    return <ArrowUpDown className="ml-1 h-4 w-4 opacity-30" />;
  };

  return (
    <TableHead 
      className={`cursor-pointer ${className}`}
      onClick={() => onSort(sortKey)}
    >
      <div className={`flex items-center ${centerContent ? 'justify-center' : ''}`}>
        {label}
        {renderIcon()}
      </div>
    </TableHead>
  );
}
