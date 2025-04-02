
import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

/**
 * Komponent som återställer skrollposition till toppen av sidan när rutten ändras
 */
export function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    // Skrolla till toppen av sidan med en mjuk effekt
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: 'smooth'
    });
  }, [pathname]);

  return null;
}
