import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Home } from "lucide-react";

export const NavigationBar = () => {
  return (
    <nav className="border-b">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between gap-4">
        <Link 
          to="/" 
          className="flex items-center gap-2 text-xl font-bold hover:text-primary transition-colors"
          aria-label="Gå till startsidan"
        >
          <Home className="h-6 w-6" />
          <span>Deals</span>
        </Link>

        <div className="flex items-center gap-4">
          <Link to="/admin">
            <Button variant="outline">Admin</Button>
          </Link>
        </div>
      </div>
    </nav>
  );
}