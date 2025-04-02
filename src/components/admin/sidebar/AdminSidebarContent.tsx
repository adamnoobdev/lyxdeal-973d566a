
import { AdminSidebarLinks } from "./AdminSidebarLinks";
import { SalonSidebarLinks } from "./SalonSidebarLinks";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { useSession } from "@/hooks/useSession";
import { useSidebar } from "@/components/ui/sidebar";

interface AdminSidebarContentProps {
  userRole?: string;
  currentPath?: string;
}

export const AdminSidebarContent = ({ userRole, currentPath }: AdminSidebarContentProps) => {
  const isAdmin = userRole === 'admin';
  const navigate = useNavigate();
  const { signOut } = useSession();
  const { state } = useSidebar();
  const isCollapsed = state === "collapsed";
  
  const handleLogout = async () => {
    try {
      console.log("Admin sidebar: Starting logout process");
      toast.loading("Loggar ut...");
      
      // Call the signOut function
      await signOut();
      
      // Visa en toast innan omdirigering
      toast.success("Du har loggats ut");
      
      // Vi använder window.location.href för att säkerställa en full sidomladdning 
      // och att all autentiseringsstatus rensas, men nu till startsidan istället för login
      window.location.href = "/";
    } catch (error) {
      console.error("Admin sidebar logout error:", error);
      toast.error("Ett fel uppstod vid utloggning");
      
      // Även vid fel, tvinga omdirigering med full sidomladdning till startsidan
      window.location.href = "/";
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
          <Button 
            variant="outline" 
            className={`w-full text-destructive hover:text-destructive ${isCollapsed ? "justify-center px-2" : "justify-start"}`} 
            onClick={handleLogout}
            title="Logga ut"
          >
            <LogOut className="h-4 w-4 flex-shrink-0" />
            {!isCollapsed && <span className="ml-2">Logga ut</span>}
          </Button>
        </div>
      </div>
    </div>
  );
};
