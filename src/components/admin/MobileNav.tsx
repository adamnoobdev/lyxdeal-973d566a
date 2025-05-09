
import { Button } from "@/components/ui/button";
import { Settings } from "lucide-react";
import { Drawer, DrawerContent, DrawerTrigger } from "@/components/ui/drawer";
import { useState } from "react";
import { AdminSidebarContent } from "./sidebar/AdminSidebarContent";
import { useSession } from "@/hooks/useSession";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useLocation } from "react-router-dom";

export const AdminMobileNav = () => {
  const [open, setOpen] = useState(false);
  const { session } = useSession();
  const location = useLocation();

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
    staleTime: 5 * 60 * 1000, // Cache data for 5 minutes
  });

  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerTrigger asChild>
        <Button 
          variant="outline"
          size="icon"
          className="fixed left-1/2 bottom-6 -translate-x-1/2 z-40 shadow-md md:hidden bg-primary text-primary-foreground hover:bg-primary/90 h-12 w-12"
        >
          <Settings className="h-5 w-5" />
          <span className="sr-only">Admin Meny</span>
        </Button>
      </DrawerTrigger>
      <DrawerContent className="h-[80vh] pt-8">
        <div className="px-4 overflow-y-auto">
          <AdminSidebarContent 
            userRole={userData?.role}
            currentPath={location.pathname}
          />
        </div>
      </DrawerContent>
    </Drawer>
  );
};
