
import { NavLink, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";

interface SidebarLinkProps {
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  children?: React.ReactNode;
  active?: boolean;
  label?: string;
  isCurrentPath?: boolean;
}

export function SidebarLink({ 
  href, 
  icon: Icon, 
  children, 
  active, 
  label,
  isCurrentPath 
}: SidebarLinkProps) {
  const location = useLocation();
  const isActive = location.pathname === href || isCurrentPath;

  return (
    <li className="flex">
      <NavLink
        to={href}
        end
        className={({ isActive: linkActive }) =>
          cn(
            buttonVariants({ variant: "ghost" }),
            "w-full justify-start gap-2 font-normal",
            (linkActive || active || isActive) && "bg-muted font-medium"
          )
        }
      >
        <Icon className="h-4 w-4" />
        {children || label}
      </NavLink>
    </li>
  );
}
