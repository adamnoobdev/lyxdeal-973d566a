
import { NavLink } from "react-router-dom";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";
import { useSidebar } from "@/components/ui/sidebar";

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
  const { state } = useSidebar();
  const isCollapsed = state === "collapsed";

  return (
    <li className="flex">
      <NavLink
        to={href}
        end
        className={({ isActive: linkActive }) =>
          cn(
            buttonVariants({ variant: "ghost" }),
            "w-full justify-start gap-2 font-normal hover:text-accent-foreground",
            isCollapsed ? "justify-center px-2" : "",
            (linkActive || active || isCurrentPath) && "font-medium text-primary" // Removed bg-muted, added text-primary
          )
        }
        title={label || (typeof children === 'string' ? children : undefined)}
      >
        <Icon className="h-4 w-4 flex-shrink-0" />
        {!isCollapsed && (children || label)}
      </NavLink>
    </li>
  );
}
