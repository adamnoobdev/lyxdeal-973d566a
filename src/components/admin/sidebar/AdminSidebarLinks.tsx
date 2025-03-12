
import { useLocation } from "react-router-dom";
import { LayoutDashboard, Tag, Store } from "lucide-react";
import { SidebarGroup, SidebarGroupContent, SidebarGroupLabel, SidebarMenu } from "@/components/ui/sidebar";
import { SidebarLink } from "./SidebarLink";

const adminLinks = [
  {
    href: "/admin",
    icon: LayoutDashboard,
    label: "Dashboard",
    exact: true
  },
  {
    href: "/admin/deals",
    icon: Tag,
    label: "Erbjudanden",
    exact: false
  },
  {
    href: "/admin/salons",
    icon: Store,
    label: "Salonger",
    exact: false
  },
] as const;

export const AdminSidebarLinks = () => {
  const location = useLocation();
  
  return (
    <SidebarGroup>
      <SidebarGroupLabel className="font-medium">Admin</SidebarGroupLabel>
      <SidebarGroupContent>
        <SidebarMenu>
          {adminLinks.map((link) => (
            <SidebarLink
              key={link.href}
              href={link.href}
              icon={link.icon}
              label={link.label}
              isCurrentPath={
                link.exact 
                  ? location.pathname === link.href 
                  : location.pathname.startsWith(link.href)
              }
            />
          ))}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );
};
