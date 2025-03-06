
import { Sidebar, SidebarTrigger } from "@/components/ui/sidebar";
import { AdminSidebarContent } from "./sidebar/AdminSidebarContent";
import { useSession } from "@/hooks/useSession";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export const AdminSidebar = () => {
  const { session } = useSession();

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
    <Sidebar className="border-r bg-background/80 backdrop-blur-sm pt-16" variant="inset" collapsible="icon">
      <SidebarTrigger className="fixed right-4 top-20 z-50 bg-background shadow-sm hover:bg-accent md:right-8" />
      <AdminSidebarContent userRole={userData?.role} />
    </Sidebar>
  );
};
