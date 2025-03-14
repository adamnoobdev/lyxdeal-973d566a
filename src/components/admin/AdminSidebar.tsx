
import { Sidebar, SidebarTrigger } from "@/components/ui/sidebar";
import { AdminSidebarContent } from "./sidebar/AdminSidebarContent";
import { useSession } from "@/hooks/useSession";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useState, useEffect, memo, useCallback, useMemo } from "react";
import { useLocation } from "react-router-dom";

// Memoize the sidebar content to prevent unnecessary re-renders
const MemoizedAdminSidebarContent = memo(AdminSidebarContent);

export const AdminSidebar = () => {
  const { session } = useSession();
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [isCollapsed, setIsCollapsed] = useState(window.innerWidth < 768);
  const location = useLocation();

  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      if (mobile && !isCollapsed) {
        setIsCollapsed(true);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [isCollapsed]);

  // Använd useCallback för att förhindra onödiga re-renders när sidebarn öppnas/stängs
  const handleToggleCollapse = useCallback(() => {
    setIsCollapsed(!isCollapsed);
  }, [isCollapsed]);

  // Använd useMemo för queryKey för att minska re-renders
  const queryKey = useMemo(() => ['user-role', session?.user?.id], [session?.user?.id]);

  // Fetch user role to determine what sidebar content to show
  const { data: userData } = useQuery({
    queryKey: queryKey,
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
    staleTime: 5 * 60 * 1000, // Cache data for 5 minutes to prevent frequent refetches
  });

  return (
    <Sidebar 
      className={`border-r bg-white pt-16 z-10 shadow-sm ${isCollapsed ? 'collapsed' : ''}`}
      variant="inset" 
      collapsible="icon"
    >
      <SidebarTrigger 
        className="fixed right-4 top-20 z-50 bg-background shadow-sm hover:bg-accent md:right-8" 
        onClick={handleToggleCollapse}
      />
      <MemoizedAdminSidebarContent 
        userRole={userData?.role} 
        currentPath={location.pathname}
      />
    </Sidebar>
  );
};
