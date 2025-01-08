import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Menu, ChevronDown } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useIsMobile } from "@/hooks/use-mobile";
import { ScrollArea } from "./ui/scroll-area";

const categories = [
  { name: "Laserhårborttagning", icon: "✨" },
  { name: "Fillers", icon: "💉" },
  { name: "Rynkbehandlingar", icon: "🔄" },
  { name: "Hudvård", icon: "🧴" },
  { name: "Hårvård", icon: "💇‍♀️" },
  { name: "Naglar", icon: "💅" },
  { name: "Massage", icon: "💆‍♀️" },
];

export const NavigationBar = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const isMobile = useIsMobile();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setIsOpen(false);
    }
  };

  const handleCategoryClick = (category: string) => {
    navigate(`/search?category=${encodeURIComponent(category)}`);
    setIsOpen(false);
  };

  const { data: { publicUrl } } = supabase
    .storage
    .from('assets')
    .getPublicUrl('Lyxdeal-logo.svg');

  console.log('Logo URL:', publicUrl);

  return (
    <nav className="border-b">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between gap-4">
        <Link 
          to="/" 
          className="flex items-center gap-2 text-xl font-bold hover:text-primary transition-colors"
          aria-label="Gå till startsidan"
        >
          <img 
            src={publicUrl} 
            alt="Lyxdeal Logo" 
            className="h-12 w-auto"
            onError={(e) => console.error('Error loading image:', e)}
          />
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-4">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="text-sm">
                Kategorier <ChevronDown className="ml-1 h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-48">
              {categories.map((category) => (
                <DropdownMenuItem
                  key={category.name}
                  onClick={() => handleCategoryClick(category.name)}
                  className="flex items-center gap-2"
                >
                  <span>{category.icon}</span>
                  <span>{category.name}</span>
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <form onSubmit={handleSearch} className="flex-1 max-w-xl mx-4 hidden md:block">
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

        <Sheet open={isOpen} onOpenChange={setIsOpen}>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" className="md:hidden">
              <Menu className="h-6 w-6" />
              <span className="sr-only">Öppna meny</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="w-full sm:w-[300px] p-0">
            <ScrollArea className="h-full">
              <div className="flex flex-col h-full">
                <SheetHeader className="p-4 border-b">
                  <SheetTitle>Meny</SheetTitle>
                </SheetHeader>
                
                <div className="p-4 border-b">
                  <form onSubmit={handleSearch} className="w-full">
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

                <div className="flex-1 p-4">
                  <h3 className="font-medium mb-2">Kategorier</h3>
                  <div className="space-y-1">
                    {categories.map((category) => (
                      <Button
                        key={category.name}
                        variant="ghost"
                        className="w-full justify-start gap-2 h-10"
                        onClick={() => handleCategoryClick(category.name)}
                      >
                        <span>{category.icon}</span>
                        <span>{category.name}</span>
                      </Button>
                    ))}
                  </div>
                </div>
              </div>
            </ScrollArea>
          </SheetContent>
        </Sheet>
      </div>
    </nav>
  );
};