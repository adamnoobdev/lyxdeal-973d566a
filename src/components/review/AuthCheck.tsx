import { Button } from "@/components/ui/button";

interface AuthCheckProps {
  children?: React.ReactNode;
}

export const AuthCheck = ({ children }: AuthCheckProps) => {
  return (
    <div className="text-center p-4 bg-gray-50 rounded-lg">
      <p className="text-gray-600">
        {children || "Du måste vara inloggad för att lämna en recension"}
      </p>
      <Button 
        onClick={() => window.location.href = '/login'} 
        className="mt-2"
      >
        Logga in
      </Button>
    </div>
  );
};