
import { useState, useEffect } from "react";

// En enkel hook för att räkna förfluten tid
export const useElapsedTime = (): number => {
  const [timeElapsed, setTimeElapsed] = useState(0);
  
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeElapsed(prev => prev + 1);
    }, 1000);
    
    return () => clearInterval(timer);
  }, []);
  
  return timeElapsed;
};
