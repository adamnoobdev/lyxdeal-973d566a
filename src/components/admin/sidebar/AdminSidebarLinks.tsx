import { SidebarGroupContent, SidebarGroupLabel, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from "@/components/ui/sidebar";
import { LayoutDashboard, Store, Tag } from "lucide-react";
import { Link, useLocation } from "react-router-dom";

const adminLinks = [
  {
    title: "Dashboard",
    icon: LayoutDashboard,
    href: "/admin",
  },
  {
    title: "Erbjudanden",
    icon: Tag,
    href: "/admin/deals",
  },
  {
    title: "Salonger",
    icon: Store,
    href: "/admin/salons",
  },
];

export const AdminSidebarLinks = () => {
  const location = useLocation();

  return (
    <>
      <SidebarGroupLabel>Administration</SidebarGroupLabel>
      <SidebarGroupContent>
        <SidebarMenu>
          {adminLinks.map((link) => (
            <SidebarMenuItem key={link.href}>
              <SidebarMenuButton
                asChild
                isActive={location.pathname === link.href}
              >
                <Link to={link.href}>
                  <link.icon className="h-4 w-4" />
                  <span>{link.title}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarGroupContent>
    </>
  );
};