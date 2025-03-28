
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Session } from '@supabase/supabase-js';
import { Button } from "@/components/ui/button";
import { User, Store } from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface UserMenuProps {
  session: Session | null;
  hasDashboard: boolean;
  dashboardPath: string;
  userRole?: string | null;
  className?: string;
}

const UserMenu: React.FC<UserMenuProps> = ({
  session,
  hasDashboard,
  dashboardPath,
  userRole,
  className = ''
}) => {
  const navigate = useNavigate();
  
  const handleLogout = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      toast.success("Du har loggats ut");
      navigate('/salon/login');
    } catch (error) {
      console.error('Utloggningsfel:', error);
      toast.error("Det gick inte att logga ut. Försök igen.");
    }
  };
  
  const goToProfile = () => {
    if (hasDashboard) {
      navigate(dashboardPath);
    } else {
      navigate('/salon/login');
    }
  };

  const handlePartnerClick = () => {
    // Navigera till salon/login sidan och se till att den scrollar till toppen
    navigate('/salon/login');
    window.scrollTo(0, 0);
  };

  if (session?.user) {
    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon" className={`h-9 w-9 ${className}`}>
            <User className="h-5 w-5" />
            <span className="sr-only">User menu</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56" align="end" forceMount>
          <DropdownMenuItem onClick={goToProfile}>
            Min profil
          </DropdownMenuItem>
          <DropdownMenuItem onClick={handleLogout}>
            Logga ut
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    );
  }

  return (
    <Button size="sm" onClick={handlePartnerClick} className={className}>
      <Store className="h-4 w-4 mr-2" />
      <span className="xs:inline">Salongspartner</span>
    </Button>
  );
};

export default UserMenu;
