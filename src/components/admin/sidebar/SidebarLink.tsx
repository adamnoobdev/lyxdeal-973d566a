
import { NavLink } from "react-router-dom";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";

interface SidebarLinkProps {
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  children: React.ReactNode;
  active?: boolean;
}

export function SidebarLink({ href, icon: Icon, children, active }: SidebarLinkProps) {
  return (
    <li className="flex">
      <NavLink
        to={href}
        className={({ isActive }) =>
          cn(
            buttonVariants({ variant: "ghost" }),
            "w-full justify-start gap-2 font-normal",
            (isActive || active) && "bg-muted font-medium"
          )
        }
      >
        <Icon className="h-4 w-4" />
        {children}
      </NavLink>
    </li>
  );
}
