import { Button } from "@/components/ui/button";
import { CategorySelector } from "@/components/CategorySelector";
import { CitySelector } from "@/components/CitySelector";
import { SearchBar } from "@/components/SearchBar";
import { LogOut, UserRound, LayoutDashboard } from "lucide-react";

interface DesktopNavigationProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;
  onSearch: (e: React.FormEvent) => void;
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
}: DesktopNavigationProps) => (
  <div className="hidden md:flex md:flex-1 md:items-center md:justify-between md:space-x-4">
    <SearchBar
      searchQuery={searchQuery}
      onSearchChange={onSearchChange}
      onSubmit={onSearch}
      className="w-full max-w-md"
    />
    <div className="flex items-center space-x-4">
      <CitySelector currentCity={currentCity} onCitySelect={onCitySelect} />
      <CategorySelector onCategorySelect={onCategorySelect} />
      {session ? (
        <>
          {(userRole === 'salon_owner' || userRole === 'admin') && (
            <Button
              variant="ghost"
              size="sm"
              className="gap-2"
              onClick={onDashboard}
            >
              <LayoutDashboard className="h-4 w-4" />
              {userRole === 'admin' ? 'Admin' : 'Portal'}
            </Button>
          )}
          <Button
            variant="ghost"
            size="sm"
            className="gap-2"
            onClick={onLogout}
          >
            <LogOut className="h-4 w-4" />
            <span>Logga ut</span>
          </Button>
        </>
      ) : (
        <Button
          variant="ghost"
          size="sm"
          className="gap-2"
          onClick={() => window.location.href = '/auth'}
        >
          <UserRound className="h-4 w-4" />
          <span>Logga in</span>
        </Button>
      )}
    </div>
  </div>
);