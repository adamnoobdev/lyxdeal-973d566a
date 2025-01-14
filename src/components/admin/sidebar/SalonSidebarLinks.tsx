import { SidebarGroupContent, SidebarGroupLabel, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from "@/components/ui/sidebar";
import { CircleDollarSign, Store } from "lucide-react";
import { Link, useLocation } from "react-router-dom";

const salonLinks = [
  {
    title: "Min salong",
    icon: Store,
    href: "/salon",
  },
  {
    title: "Köp",
    icon: CircleDollarSign,
    href: "/salon/purchases",
  },
];

export const SalonSidebarLinks = () => {
  const location = useLocation();

  return (
    <>
      <SidebarGroupLabel>Salong</SidebarGroupLabel>
      <SidebarGroupContent>
        <SidebarMenu>
          {salonLinks.map((link) => (
            <SidebarMenuItem key={link.href}>
              <SidebarMenuButton
                asChild
                active={location.pathname === link.href}
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