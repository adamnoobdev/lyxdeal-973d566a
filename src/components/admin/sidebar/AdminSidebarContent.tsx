
import { AdminSidebarLinks } from "./AdminSidebarLinks";
import { SalonSidebarLinks } from "./SalonSidebarLinks";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface AdminSidebarContentProps {
  userRole?: string;
  currentPath?: string;
}

export const AdminSidebarContent = ({ userRole, currentPath }: AdminSidebarContentProps) => {
  const isAdmin = userRole === 'admin';
  const navigate = useNavigate();
  
  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      toast.success("Du har loggat ut");
      navigate("/");
    } catch (error) {
      console.error("Logout error:", error);
      toast.error("Ett fel uppstod vid utloggning");
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
