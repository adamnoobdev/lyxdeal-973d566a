import { SidebarContent, SidebarGroup } from "@/components/ui/sidebar";
import { AdminSidebarLinks } from "./AdminSidebarLinks";
import { SalonSidebarLinks } from "./SalonSidebarLinks";
import { useSession } from "@/hooks/useSession";
import { supabase } from "@/integrations/supabase/client";
import { useEffect, useState } from "react";

export const AdminSidebarContent = () => {
  const { session } = useSession();
  const [userRole, setUserRole] = useState<string | null>(null);

  useEffect(() => {
    const fetchUserRole = async () => {
      if (session?.user) {
        const { data: salon } = await supabase
          .from('salons')
          .select('role')
          .eq('user_id', session.user.id)
          .single();
        
        setUserRole(salon?.role || null);
      }
    };

    fetchUserRole();
  }, [session]);

  return (
    <SidebarContent>
      <SidebarGroup>
        <AdminSidebarLinks />
      </SidebarGroup>
      {userRole === 'salon_owner' && (
        <SidebarGroup>
          <SalonSidebarLinks />
        </SidebarGroup>
      )}
    </SidebarContent>
  );
};