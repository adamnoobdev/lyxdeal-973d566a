import { Button } from "@/components/ui/button";
import { LogOut, UserRound } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { CategorySelector } from "../CategorySelector";
import { CitySelector } from "../CitySelector";
import { Session } from "@supabase/supabase-js";

interface DesktopNavProps {
  currentCity: string;
  onCitySelect: (city: string) => void;
  onCategorySelect: (category: string) => void;
  session: Session | null;
  onLogout: () => Promise<void>;
}

export const DesktopNav = ({
  currentCity,
  onCitySelect,
  onCategorySelect,
  session,
  onLogout
}: DesktopNavProps) => {
  const navigate = useNavigate();

  return (
    <div className="hidden md:flex items-center gap-4">
      <CitySelector 
        currentCity={currentCity}
        onCitySelect={onCitySelect}
      />
      <CategorySelector 
        onCategorySelect={onCategorySelect}
      />
      {session ? (
        <Button
          variant="ghost"
          size="sm"
          onClick={onLogout}
          className="gap-2"
        >
          <LogOut className="h-4 w-4" />
          Logga ut
        </Button>
      ) : (
        <Button
          variant="ghost"
          size="icon"
          onClick={() => navigate("/login")}
          aria-label="Logga in"
        >
          <UserRound className="h-5 w-5" />
        </Button>
      )}
    </div>
  );
};