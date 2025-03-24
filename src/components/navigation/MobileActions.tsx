
import { Button } from "@/components/ui/button";
import { LogOut, UserRound, LayoutDashboard } from "lucide-react";
import { MobileNav } from "./MobileNav";

interface MobileActionsProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  currentCity: string;
  onCitySelect: (city: string) => void;
  onCategorySelect: (category: string) => void;
  session: any;
  onLogout: () => Promise<void>;
  onLogin: () => void;
  userRole: 'customer' | 'salon_owner' | 'admin' | null;
  onDashboard: () => void;
}

export const MobileActions = ({
  isOpen,
  setIsOpen,
  currentCity,
  onCitySelect,
  onCategorySelect,
  session,
  onLogout,
  onLogin,
  userRole,
  onDashboard
}: MobileActionsProps) => (
  <div className="flex flex-1 items-center justify-end gap-1 md:hidden">
    {session ? (
      <>
        {(userRole === 'salon_owner' || userRole === 'admin') && (
          <Button
            variant="ghost"
            size="icon"
            className="hover:bg-primary/10"
            onClick={onDashboard}
            aria-label={userRole === 'admin' ? 'Admin' : 'Portal'}
          >
            <LayoutDashboard className="h-5 w-5" />
          </Button>
        )}
        <Button
          variant="ghost"
          size="icon"
          className="hover:bg-primary/10"
          onClick={onLogout}
          aria-label="Logga ut"
        >
          <LogOut className="h-5 w-5" />
        </Button>
      </>
    ) : (
      <Button
        variant="ghost"
        size="sm"
        className="gap-2 hover:bg-primary/10"
        onClick={onLogin}
      >
        <UserRound className="h-5 w-5" />
        <span className="hidden xs:inline">Logga in</span>
      </Button>
    )}

    <MobileNav
      isOpen={isOpen}
      setIsOpen={setIsOpen}
      currentCity={currentCity}
      onCitySelect={onCitySelect}
      onCategorySelect={onCategorySelect}
      session={session}
      onLogout={onLogout}
    />
  </div>
);
