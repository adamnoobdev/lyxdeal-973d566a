import { Button } from "@/components/ui/button";
import { SearchContainer } from "@/components/SearchContainer";
import { CitySelector } from "@/components/CitySelector";
import { CategorySelector } from "@/components/CategorySelector";
import { LayoutDashboard, LogOut, UserRound } from "lucide-react";
import { useNavigate } from "react-router-dom";
interface DesktopNavigationProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onSearch: () => void;
  currentCity: string;
  onCitySelect: (city: string) => void;
  onCategorySelect: (category: string) => void;
  session: any;
  onLogout: () => Promise<void>;
  userRole: 'customer' | 'salon_owner' | 'admin' | null;
  onDashboard: () => void;
}
export const DesktopNavigation = ({
  searchQuery,
  onSearchChange,
  onSearch,
  currentCity,
  onCitySelect,
  onCategorySelect,
  session,
  onLogout,
  userRole,
  onDashboard
}: DesktopNavigationProps) => {
  const navigate = useNavigate();
  return <div className="hidden items-center md:flex md:flex-1 md:gap-4">
      <SearchContainer searchQuery={searchQuery} onSearchChange={onSearchChange} onSearch={onSearch} />

      <div className="flex items-center gap-2">
        <CitySelector currentCity={currentCity} onCitySelect={onCitySelect} variant="desktop" />

        <CategorySelector onCategorySelect={onCategorySelect} variant="desktop" />

        {session ? <>
            {(userRole === 'salon_owner' || userRole === 'admin') && <Button variant="ghost" size="sm" className="gap-2" onClick={onDashboard}>
                <LayoutDashboard className="h-4 w-4" />
                <span className="hidden lg:inline">
                  {userRole === 'admin' ? 'Admin' : 'Portal'}
                </span>
              </Button>}
            <Button variant="ghost" size="sm" className="gap-2" onClick={onLogout}>
              <LogOut className="h-4 w-4" />
              <span className="hidden lg:inline">Logga ut</span>
            </Button>
          </> : <Button variant="ghost" size="sm" className="gap-2" onClick={() => navigate("/auth")}>
            <UserRound className="h-4 w-4" />
            
          </Button>}
      </div>
    </div>;
};