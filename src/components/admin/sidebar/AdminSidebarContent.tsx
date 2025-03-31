
import { AdminSidebarLinks } from "./AdminSidebarLinks";
import { SalonSidebarLinks } from "./SalonSidebarLinks";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { useSession } from "@/hooks/useSession";

interface AdminSidebarContentProps {
  userRole?: string;
  currentPath?: string;
}

export const AdminSidebarContent = ({ userRole, currentPath }: AdminSidebarContentProps) => {
  const isAdmin = userRole === 'admin';
  const navigate = useNavigate();
  const { signOut } = useSession();
  
  const handleLogout = async () => {
    try {
      console.log("Admin sidebar: Starting logout process");
      
      // Call the signOut function and wait for it to complete
      const success = await signOut();
      
      if (success) {
        console.log("Admin sidebar: Logout successful, navigating to login page");
        
        // Clear local session state before navigation
        window.localStorage.removeItem('supabase.auth.token');
        sessionStorage.removeItem('supabase.auth.token');
        
        // Use immediate timeout before navigation to allow state updates
        setTimeout(() => {
          console.log("Admin sidebar: Forcibly navigating to login page");
          window.location.href = "/salon/login"; // Force full page reload to clear all state
        }, 50);
      } else {
        console.error("Admin sidebar: Logout failed");
        toast.error("Ett fel uppstod vid utloggning. Försök igen.");
      }
    } catch (error) {
      console.error("Admin sidebar logout error:", error);
      toast.error("Ett fel uppstod vid utloggning");
      
      // Force navigation even on error as fallback
      setTimeout(() => {
        console.log("Admin sidebar: Forcibly navigating to login page after error");
        window.location.href = "/salon/login"; // Use window.location for a complete refresh
      }, 50);
    }
  };
  
  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-auto scrollbar-hide p-4 space-y-6">
        {isAdmin && <AdminSidebarLinks currentPath={currentPath} />}
        {!isAdmin && <SalonSidebarLinks currentPath={currentPath} />}
      </div>
      
      <div className="p-4 mt-auto">
        <Separator className="mb-4" />
        <div className="space-y-2">
          <Button variant="outline" className="w-full justify-start text-destructive hover:text-destructive" onClick={handleLogout}>
            <LogOut className="mr-2 h-4 w-4" />
            <span>Logga ut</span>
          </Button>
        </div>
      </div>
    </div>
  );
};
