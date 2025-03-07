
import React from 'react';
import { Sun, Moon } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { useTheme } from 'next-themes';

const ThemeToggle: React.FC = () => {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = React.useState(false);

  // When mounted on client, show the theme toggle
  React.useEffect(() => setMounted(true), []);

  if (!mounted) return null;

  return (
    <Button 
      variant="ghost" 
      size="icon" 
      onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')} 
      className="ml-1"
    >
      <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
      <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
      <span className="sr-only">Toggle theme</span>
    </Button>
  );
};

export default ThemeToggle;
