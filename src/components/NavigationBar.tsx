import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Home } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";

export const NavigationBar = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

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

        <NavigationMenu>
          <NavigationMenuList>
            <NavigationMenuItem>
              <NavigationMenuTrigger>Kategorier</NavigationMenuTrigger>
              <NavigationMenuContent>
                <div className="grid gap-3 p-4 w-[200px]">
                  <NavigationMenuLink asChild>
                    <Link to="/search?category=Skönhet%20%26%20Spa" className="block p-2 hover:bg-accent rounded-md">
                      Skönhet & Spa
                    </Link>
                  </NavigationMenuLink>
                  <NavigationMenuLink asChild>
                    <Link to="/search?category=Restauranger" className="block p-2 hover:bg-accent rounded-md">
                      Restauranger
                    </Link>
                  </NavigationMenuLink>
                  <NavigationMenuLink asChild>
                    <Link to="/search?category=Aktiviteter" className="block p-2 hover:bg-accent rounded-md">
                      Aktiviteter
                    </Link>
                  </NavigationMenuLink>
                  <NavigationMenuLink asChild>
                    <Link to="/search?category=Resor" className="block p-2 hover:bg-accent rounded-md">
                      Resor
                    </Link>
                  </NavigationMenuLink>
                  <NavigationMenuLink asChild>
                    <Link to="/search?category=Shopping" className="block p-2 hover:bg-accent rounded-md">
                      Shopping
                    </Link>
                  </NavigationMenuLink>
                </div>
              </NavigationMenuContent>
            </NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>

        <form onSubmit={handleSearch} className="flex-1 max-w-xl">
          <div className="relative">
            <Search className="absolute left-2 top-2.5 h-5 w-5 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Sök erbjudanden..."
              className="w-full pl-9"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </form>
      </div>
    </nav>
  );
}