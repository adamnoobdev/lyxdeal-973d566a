
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

interface DealsHeaderProps {
  onCreateClick: () => void;
}

export const DealsHeader = ({ onCreateClick }: DealsHeaderProps) => {
  return (
    <Card className="bg-white shadow-sm border border-secondary/20 mb-6">
      <CardHeader className="flex flex-col sm:flex-row justify-between items-start sm:items-center p-6">
        <div>
          <CardTitle className="text-2xl font-bold tracking-tight text-primary">Erbjudanden</CardTitle>
          <CardDescription className="text-muted-foreground">
            Hantera och övervaka alla erbjudanden
          </CardDescription>
        </div>
        <Button 
          onClick={onCreateClick} 
          size="sm" 
          className="w-full sm:w-auto mt-4 sm:mt-0 bg-primary hover:bg-primary/90"
        >
          <Plus className="h-4 w-4 mr-2" />
          Skapa erbjudande
        </Button>
      </CardHeader>
    </Card>
  );
};
