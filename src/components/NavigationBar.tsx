import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import {
  Command,
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { useState } from "react";

interface NavigationItem {
  title: string;
  items: {
    title: string;
    href: string;
  }[];
}

interface NavigationBarProps {
  navigationItems: NavigationItem[];
  onSearch: (query: string) => void;
}

export const NavigationBar = ({ navigationItems, onSearch }: NavigationBarProps) => {
  const [open, setOpen] = useState(false);

  return (
    <div className="flex items-center justify-between w-full">
      <NavigationMenu className="flex-1">
        <NavigationMenuList>
          {navigationItems.map((section) => (
            <NavigationMenuItem key={section.title}>
              <NavigationMenuTrigger>{section.title}</NavigationMenuTrigger>
              <NavigationMenuContent>
                <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px]">
                  {section.items.map((item) => (
                    <li key={item.title}>
                      <NavigationMenuLink asChild>
                        <a
                          href={item.href}
                          className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                        >
                          <div className="text-sm font-medium leading-none">{item.title}</div>
                        </a>
                      </NavigationMenuLink>
                    </li>
                  ))}
                </ul>
              </NavigationMenuContent>
            </NavigationMenuItem>
          ))}
        </NavigationMenuList>
      </NavigationMenu>

      <div className="flex-1 flex justify-center">
        <Command className="rounded-lg border shadow-md w-[300px]">
          <CommandInput placeholder="Sök erbjudanden..." onValueChange={onSearch} />
        </Command>
      </div>

      <div className="flex-1" /> {/* Spacer för att centrera sökfältet */}
    </div>
  );
};