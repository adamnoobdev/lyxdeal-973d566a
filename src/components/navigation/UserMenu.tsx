import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Session } from '@supabase/supabase-js';
import { Button } from "@/components/ui/button";
import { User } from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { toast } from "sonner";
import { useSession } from "@/hooks/useSession";

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
  const { signOut } = useSession();
  
  const handleLogout = async () => {
    try {
      if (!session) {
        toast.error("Ingen aktiv session att logga ut från");
        navigate('/');
        return;
      }
      
      console.log("UserMenu: Initiating logout");
      toast.loading("Loggar ut...");
      
      await signOut();
      
      toast.success("Du har loggats ut");
      
      window.location.href = '/';
    } catch (error) {
      console.error('Utloggningsfel:', error);
      toast.error("Det gick inte att logga ut. Försök igen.");
      
      window.location.href = '/';
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
    <Button 
      variant="outline" 
      size="sm" 
      onClick={handlePartnerClick} 
      className={`${className}`}
    >
      Logga in
    </Button>
  );
};

export default UserMenu;
