
import * as React from "react";

const MOBILE_BREAKPOINT = 640; // Samma som Tailwind's "sm" breakpoint

export function useIsMobile() {
  const [isMobile, setIsMobile] = React.useState<boolean>(() => {
    // Set initial value based on window width if in browser environment
    return typeof window !== 'undefined' ? window.innerWidth < MOBILE_BREAKPOINT : false;
  });

  React.useEffect(() => {
    // Funktion för att kontrollera om skärmen är mobil
    const checkIsMobile = () => {
      setIsMobile(window.innerWidth < MOBILE_BREAKPOINT);
    };
    
    // Lägg till event listeners
    window.addEventListener("resize", checkIsMobile);
    
    // Sätt initialt värde
    checkIsMobile();
    
    // Städa upp event listeners
    return () => {
      window.removeEventListener("resize", checkIsMobile);
    };
  }, []);

  return isMobile;
}
