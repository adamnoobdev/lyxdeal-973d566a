
import { useState } from "react";
import { toast } from "sonner";

interface Collaboration {
  id: string;
  discount_code: string;
  created_at: string;
  views: number;
  redemptions: number;
}

export function useCsvExport(collaborations: Collaboration[]) {
  const [isExporting, setIsExporting] = useState(false);

  const exportToCsv = () => {
    try {
      setIsExporting(true);
      
      if (collaborations.length === 0) {
        toast.error('Inga data att exportera');
        setIsExporting(false);
        return;
      }

      // Create CSV headers
      const headers = ['ID', 'Rabattkod', 'Skapad', 'Visningar', 'Inlösta', 'Konvertering (%)'];
      
      // Create CSV data
      const csvData = collaborations.map(collab => {
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
    } finally {
      setIsExporting(false);
    }
  };

  return { exportToCsv, isExporting };
}
