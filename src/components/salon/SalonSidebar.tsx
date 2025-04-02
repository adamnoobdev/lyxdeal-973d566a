
import { Sidebar, SidebarTrigger } from "@/components/ui/sidebar";
import { SalonSidebarContent } from "./sidebar/SalonSidebarContent";
import { useSession } from "@/hooks/useSession";
import { useState, useEffect, memo } from "react";
import { useLocation } from "react-router-dom";
import { MenuIcon } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";

// Memoize the sidebar content to prevent unnecessary re-renders
const MemoizedSalonSidebarContent = memo(SalonSidebarContent);

export const SalonSidebar = () => {
  const { session } = useSession();
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const location = useLocation();

  // Update useEffect for better responsiveness
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <>
      {/* Only show the desktop sidebar trigger on non-mobile screens */}
      {!isMobile && (
        <SidebarTrigger 
          className="fixed top-4 z-40 flex h-8 w-8 items-center justify-center rounded-md bg-background border shadow-sm hover:bg-accent ml-[13.5rem] md:ml-[13.5rem]" 
        >
          <MenuIcon className="h-4 w-4 text-primary" />
        </SidebarTrigger>
      )}
      
      <Sidebar 
        className="border-r bg-white pt-16 z-10 shadow-sm"
        variant="inset" 
        collapsible={isMobile ? "offcanvas" : "icon"}
      >
        <MemoizedSalonSidebarContent 
          currentPath={location.pathname}
        />
      </Sidebar>
    </>
  );
};
