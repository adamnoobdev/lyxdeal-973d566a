
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableHead, TableBody, TableRow, TableCell, TableHeader } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { formatDistanceToNow } from "date-fns";
import { sv } from "date-fns/locale";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Download, ArrowUpDown } from "lucide-react";
import { toast } from "sonner";

export function ActiveCollaborationsList({ collaborations }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortConfig, setSortConfig] = useState({
    key: 'created_at',
    direction: 'desc'
  });
  
  // Sorting logic
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

  // Filtering logic
  const filteredCollaborations = sortedCollaborations.filter(collab => {
    const searchLower = searchTerm.toLowerCase();
    return (
      (collab.discount_code && collab.discount_code.toLowerCase().includes(searchLower)) ||
      (collab.id && collab.id.toString().toLowerCase().includes(searchLower))
    );
  });

  // Handle sort
  const handleSort = (key) => {
    setSortConfig(prevConfig => ({
      key,
      direction: prevConfig.key === key && prevConfig.direction === 'asc' ? 'desc' : 'asc'
    }));
  };

  // Export to CSV
  const exportToCsv = () => {
    try {
      if (filteredCollaborations.length === 0) {
        toast.error('Inga data att exportera');
        return;
      }

      // Create CSV headers
      const headers = ['ID', 'Rabattkod', 'Skapad', 'Visningar', 'Inlösta', 'Konvertering (%)'];
      
      // Create CSV data
      const csvData = filteredCollaborations.map(collab => {
        const conversionRate = collab.views > 0 
          ? ((collab.redemptions / collab.views) * 100).toFixed(1) 
          : "0.0";
        
        const createdDate = collab.created_at 
          ? new Date(collab.created_at).toLocaleDateString('sv-SE') 
          : 'Okänt datum';
          
        return [
          collab.id,
          collab.discount_code || 'Ingen kod',
          createdDate,
          collab.views || 0,
          collab.redemptions || 0,
          `${conversionRate}%`
        ];
      });
      
      // Combine headers and data
      const csvContent = [
        headers.join(','),
        ...csvData.map(row => row.join(','))
      ].join('\n');
      
      // Create and download the file
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.setAttribute('href', url);
      link.setAttribute('download', `aktiva-samarbeten-${new Date().toISOString().slice(0, 10)}.csv`);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      toast.success('Data exporterad till CSV');
    } catch (error) {
      console.error('Export error:', error);
      toast.error('Kunde inte exportera data');
    }
  };

  // Render sort icon
  const renderSortIcon = (key) => {
    if (sortConfig.key === key) {
      return (
        <ArrowUpDown className={`ml-1 h-4 w-4 ${sortConfig.direction === 'asc' ? 'rotate-180' : ''}`} />
      );
    }
    return <ArrowUpDown className="ml-1 h-4 w-4 opacity-30" />;
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <CardTitle>Aktiva samarbeten</CardTitle>
          <div className="flex flex-col sm:flex-row gap-2 items-start sm:items-center">
            <div className="relative w-full sm:w-auto">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Sök på rabattkod..."
                className="pl-8 w-full"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={exportToCsv} 
              className="flex items-center gap-1 w-full sm:w-auto"
            >
              <Download className="h-4 w-4" />
              <span>Exportera</span>
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="rounded-md border overflow-hidden">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead 
                    className="cursor-pointer"
                    onClick={() => handleSort('discount_code')}
                  >
                    <div className="flex items-center">
                      Rabattkod
                      {renderSortIcon('discount_code')}
                    </div>
                  </TableHead>
                  <TableHead 
                    className="hidden sm:table-cell cursor-pointer"
                    onClick={() => handleSort('created_at')}
                  >
                    <div className="flex items-center">
                      Skapad
                      {renderSortIcon('created_at')}
                    </div>
                  </TableHead>
                  <TableHead 
                    className="text-center cursor-pointer"
                    onClick={() => handleSort('views')}
                  >
                    <div className="flex items-center justify-center">
                      Visningar
                      {renderSortIcon('views')}
                    </div>
                  </TableHead>
                  <TableHead 
                    className="text-center cursor-pointer"
                    onClick={() => handleSort('redemptions')}
                  >
                    <div className="flex items-center justify-center">
                      Inlösta
                      {renderSortIcon('redemptions')}
                    </div>
                  </TableHead>
                  <TableHead className="text-center">Konvertering</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredCollaborations.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                      {searchTerm ? 'Inga samarbeten matchar din sökning.' : 'Inga samarbeten hittades.'}
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredCollaborations.map((collab) => {
                    const conversionRate = collab.views > 0 
                      ? ((collab.redemptions / collab.views) * 100).toFixed(1) 
                      : "0.0";
                    
                    let badgeVariant = "secondary";
                    if (parseFloat(conversionRate) > 5) badgeVariant = "success";
                    if (parseFloat(conversionRate) > 10) badgeVariant = "default";
                    
                    return (
                      <TableRow key={collab.id} className="group hover:bg-muted/40">
                        <TableCell className="font-medium">
                          <Badge variant="outline" className="font-mono">
                            {collab.discount_code}
                          </Badge>
                        </TableCell>
                        <TableCell className="hidden sm:table-cell text-muted-foreground">
                          {collab.created_at ? (
                            formatDistanceToNow(new Date(collab.created_at), { 
                              addSuffix: true,
                              locale: sv 
                            })
                          ) : (
                            "Okänt datum"
                          )}
                        </TableCell>
                        <TableCell className="text-center">{collab.views || 0}</TableCell>
                        <TableCell className="text-center">{collab.redemptions || 0}</TableCell>
                        <TableCell className="text-center">
                          <Badge variant={badgeVariant}>
                            {conversionRate}%
                          </Badge>
                        </TableCell>
                      </TableRow>
                    );
                  })
                )}
              </TableBody>
            </Table>
          </div>
        </div>
        <div className="text-xs text-muted-foreground mt-4 text-center">
          Visar {filteredCollaborations.length} av totalt {collaborations.length} samarbeten
        </div>
      </CardContent>
    </Card>
  );
}
