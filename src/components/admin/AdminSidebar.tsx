import { LayoutDashboard, Store, Tag } from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { useNavigate, useLocation } from "react-router-dom";

const menuItems = [
  {
    title: "Översikt",
    icon: LayoutDashboard,
    path: "/admin",
  },
  {
    title: "Erbjudanden",
    icon: Tag,
    path: "/admin/deals",
  },
  {
    title: "Salonger",
    icon: Store,
    path: "/admin/salons",
  },
];

export const AdminSidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <Sidebar className="pt-16" variant="inset" collapsible="icon">
      <SidebarTrigger className="absolute right-2 top-[4.5rem]" />
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Administration</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    onClick={() => navigate(item.path)}
                    className={
                      location.pathname === item.path
                        ? "bg-accent text-accent-foreground"
                        : ""
                    }
                    tooltip={item.title}
                  >
                    <item.icon className="h-4 w-4" />
                    <span>{item.title}</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
};