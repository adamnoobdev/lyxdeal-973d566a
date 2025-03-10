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
  <div className="flex flex-1 items-center justify-end gap-2 md:hidden">
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
            <span className="sr-only">
              {userRole === 'admin' ? 'Admin' : 'Portal'}
            </span>
          </Button>
        )}
        <Button
          variant="ghost"
          size="sm"
          className="gap-2"
          onClick={onLogout}
        >
          <LogOut className="h-4 w-4" />
          <span className="sr-only">Logga ut</span>
        </Button>
      </>
    ) : (
      <Button
        variant="ghost"
        size="sm"
        className="gap-2"
        onClick={onLogin}
      >
        <UserRound className="h-4 w-4" />
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