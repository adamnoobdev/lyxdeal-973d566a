
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { MoveRight } from "lucide-react";

export const NavigationButtons = () => {
  return (
    <div className="pt-6 flex flex-col gap-2">
      <Button asChild className="w-full flex items-center justify-center gap-2">
        <Link to="/salon/login">
          <span>Gå till inloggning</span>
          <MoveRight className="h-4 w-4" />
        </Link>
      </Button>
      
      <Button variant="outline" asChild className="w-full">
        <Link to="/">
          Gå till startsidan
        </Link>
      </Button>
    </div>
  );
};
