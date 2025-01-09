import { useState, useEffect, useCallback } from "react";

interface ScrollState {
  isScrolled: boolean;
  showMobileSearch: boolean;
}

export const useScroll = (threshold: number = 50): ScrollState => {
  const [scrollState, setScrollState] = useState<ScrollState>({
    isScrolled: false,
    showMobileSearch: true,
  });
  const [lastScrollY, setLastScrollY] = useState(0);

  const handleScroll = useCallback(() => {
    const currentScrollY = window.scrollY;
    
    requestAnimationFrame(() => {
      setScrollState({
        isScrolled: currentScrollY > threshold,
        showMobileSearch: currentScrollY <= lastScrollY || currentScrollY < threshold,
      });
      setLastScrollY(currentScrollY);
    });
  }, [lastScrollY, threshold]);

  useEffect(() => {
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [handleScroll]);

  return scrollState;
};