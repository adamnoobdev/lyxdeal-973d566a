
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { UserRound, LogOut, Settings, Award } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useSignOut } from "@/hooks/auth/useSignOut";

interface UserMenuProps {
  className?: string;
  userRole?: string | null;
}

export function UserMenu({ className, userRole }: UserMenuProps) {
  const { user, profile, loading } = useAuth();
  const { signOut } = useSignOut();
  const [initials, setInitials] = useState<string>("");

  useEffect(() => {
    if (user?.email) {
      setInitials(
        user.email
          .split("@")[0]
          .slice(0, 2)
          .toUpperCase()
      );
    }
  }, [user]);

  if (!user && !loading) {
    return (
      <Button variant="ghost" size="icon" asChild>
        <Link to="/auth">
          <UserRound className="h-5 w-5" />
        </Link>
      </Button>
    );
  }

  if (loading) {
    return (
      <Button variant="ghost" size="icon" disabled>
        <span className="animate-pulse">...</span>
      </Button>
    );
  }

  // Konvertera profilrollen från API:et till visningstext för användargränssnittet
  const getRoleDisplayText = () => {
    // Använd först userRole från props om det finns
    const roleToUse = userRole || profile?.role;
    
    switch(roleToUse) {
      case 'creator':
        return 'Kreatör';
      case 'admin':
        return 'Administratör';
      case 'salon_owner':
        return 'Salongsägare';
      default:
        return 'Användare';
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="relative h-8 w-8 rounded-full"
        >
          <Avatar className="h-8 w-8">
            <AvatarFallback className="bg-primary/10 text-primary text-xs">
              {initials}
            </AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end" forceMount>
        <DropdownMenuLabel>
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">{user?.email}</p>
            <p className="text-xs leading-none text-muted-foreground">
              {getRoleDisplayText()}
            </p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          {profile?.role === 'creator' && (
            <DropdownMenuItem asChild>
              <Link to="/creator/dashboard">
                <Award className="mr-2 h-4 w-4" />
                <span>Kreatörportal</span>
              </Link>
            </DropdownMenuItem>
          )}
          {profile?.role === 'admin' && (
            <DropdownMenuItem asChild>
              <Link to="/admin">
                <Settings className="mr-2 h-4 w-4" />
                <span>Admin</span>
              </Link>
            </DropdownMenuItem>
          )}
          {profile?.role === 'salon_owner' && (
            <DropdownMenuItem asChild>
              <Link to="/salon/dashboard">
                <Settings className="mr-2 h-4 w-4" />
                <span>Dashboard</span>
              </Link>
            </DropdownMenuItem>
          )}
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={() => signOut()}>
          <LogOut className="mr-2 h-4 w-4" />
          <span>Logga ut</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
