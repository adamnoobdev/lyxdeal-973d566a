
import { Sidebar, SidebarTrigger } from "@/components/ui/sidebar";
import { AdminSidebarContent } from "./sidebar/AdminSidebarContent";
import { useSession } from "@/hooks/useSession";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useState, useEffect, useCallback } from "react";
import { useSidebar } from "@/components/ui/sidebar/sidebar-provider";

export const AdminSidebar = () => {
  const { session } = useSession();
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const { setOpen, toggleSidebar } = useSidebar();
  
  const handleResize = useCallback(() => {
    const newIsMobile = window.innerWidth < 768;
    setIsMobile(newIsMobile);
    if (!newIsMobile) {
      setOpen(true);
    }
  }, [setOpen]);
  
  useEffect(() => {
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [handleResize]);

  // Fetch user role to determine what sidebar content to show
  const { data: userData } = useQuery({
    queryKey: ['user-role', session?.user?.id],
    queryFn: async () => {
      if (!session?.user?.id) return null;
      
      const { data, error } = await supabase
        .from('salons')
        .select('role')
        .eq('user_id', session.user.id)
        .single();
      
      if (error) {
        console.error('Error fetching user role:', error);
        return null;
      }
      
      return data;
    },
    enabled: !!session?.user?.id,
  });

  return (
    <Sidebar 
      className="border-r bg-background pt-16 shadow-sm" 
      variant={isMobile ? "floating" : "inset"} 
      collapsible={isMobile ? "offcanvas" : "icon"}
    >
      <SidebarTrigger 
        className="fixed right-4 top-20 bg-background shadow-sm hover:bg-accent md:right-8 lg:hidden" 
        onClick={toggleSidebar}
      />
      <AdminSidebarContent userRole={userData?.role} />
    </Sidebar>
  );
};
