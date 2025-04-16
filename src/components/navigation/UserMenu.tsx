
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
import { User, LogOut, Settings, Award } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useSignOut } from "@/hooks/auth/useSignOut";

export function UserMenu() {
  const { user, profile, loading } = useAuth();
  const { signOut } = useSignOut();
  const [initials, setInitials] = useState<string>("");

  useEffect(() => {
    if (user?.email) {
      // Generate initials from email
      setInitials(
        user.email
          .split("@")[0]
          .slice(0, 2)
          .toUpperCase()
      );
    }
  }, [user]);

  // Show sign in button if not signed in
  if (!user && !loading) {
    return (
      <Button variant="outline" size="sm" asChild>
        <Link to="/auth">Logga in</Link>
      </Button>
    );
  }

  // Show loading state
  if (loading) {
    return (
      <Button variant="outline" size="sm" disabled>
        <span className="animate-pulse">...</span>
      </Button>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className="relative h-9 w-9 rounded-full"
        >
          <Avatar className="h-9 w-9">
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
            {profile?.role && (
              <p className="text-xs leading-none text-muted-foreground">
                {profile.role === 'creator' ? 'Kreatör' : 
                 profile.role === 'admin' ? 'Administratör' : 
                 profile.role === 'salon_owner' ? 'Salongsägare' : 'Användare'}
              </p>
            )}
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
        <DropdownMenuItem onClick={signOut}>
          <LogOut className="mr-2 h-4 w-4" />
          <span>Logga ut</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
