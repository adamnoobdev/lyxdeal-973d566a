
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
      // Använd den förbättrade signOut-funktionen
      const success = await signOut();
      
      // Alltid navigera till startsidan, oavsett resultat
      navigate("/salon/login", { replace: true });
    } catch (error) {
      console.error("Logout error:", error);
      toast.error("Ett fel uppstod vid utloggning");
      
      // Tvinga ändå fram en navigering
      navigate("/salon/login", { replace: true });
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
