
import React from 'react';
import { Link } from 'react-router-dom';
import { Session } from '@supabase/supabase-js';
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

interface UserMenuProps {
  session: Session | null;
  hasDashboard: boolean;
  dashboardPath: string;
  userRole?: string | null;
}

const UserMenu: React.FC<UserMenuProps> = ({
  session,
  hasDashboard,
  dashboardPath,
  userRole
}) => {
  if (session?.user) {
    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon" className="h-9 w-9 rounded-full">
            <Avatar className="h-8 w-8">
              <AvatarImage src={session.user.user_metadata?.avatar_url} alt={session.user.user_metadata?.full_name} />
              <AvatarFallback>{session.user.user_metadata?.full_name?.substring(0, 2).toUpperCase() || 'U'}</AvatarFallback>
            </Avatar>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56" align="end" forceMount>
          <DropdownMenuItem onClick={() => window.location.href = '/auth'}>
            Min profil
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => window.location.href = '/auth'}>
            Logga ut
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    );
  }

  return (
    <Button size="sm" asChild>
      <Link to="/auth">Logga in</Link>
    </Button>
  );
};

export default UserMenu;
