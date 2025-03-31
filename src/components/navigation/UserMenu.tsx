
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Session } from '@supabase/supabase-js';
import { Button } from "@/components/ui/button";
import { User, Store } from 'lucide-react';
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
        navigate('/salon/login');
        return;
      }
      
      console.log("UserMenu: Initiating logout");
      // Visa att utloggningen pågår
      toast.loading("Loggar ut...");
      
      // Anropa signOut från hooken
      await signOut();
      
      // Framgångsmeddelande
      toast.success("Du har loggats ut");
      
      // Använd window.location.href för att tvinga en full sidomladdning
      window.location.href = '/salon/login';
      
    } catch (error) {
      console.error('Utloggningsfel:', error);
      toast.error("Det gick inte att logga ut. Försök igen.");
      
      // Även om det finns ett fel, försöker vi fortfarande navigera bort med full sidomladdning
      window.location.href = '/salon/login';
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
    <Button size="sm" onClick={handlePartnerClick} className={className}>
      <Store className="h-4 w-4 mr-2" />
      <span className="xs:inline">Salongspartner</span>
    </Button>
  );
};

export default UserMenu;
