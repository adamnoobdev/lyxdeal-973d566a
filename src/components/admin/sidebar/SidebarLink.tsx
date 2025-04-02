
import { NavLink } from "react-router-dom";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";
import { LucideIcon } from "lucide-react";

interface SidebarLinkProps {
  href: string;
  icon: LucideIcon;
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
  return (
    <li className="flex list-none">
      <NavLink
        to={href}
        end={href === '/admin'}
        className={({ isActive: linkActive }) =>
          cn(
            buttonVariants({ variant: "ghost" }),
            "w-full justify-start gap-2 font-normal hover:text-accent-foreground",
            (linkActive || active || isCurrentPath) && "bg-muted font-medium"
          )
        }
      >
        <Icon className="h-4 w-4" />
        <span>{children || label}</span>
      </NavLink>
    </li>
  );
}
