
import { useState, useEffect } from 'react';

/**
 * A hook that returns whether the current viewport matches the given media query
 * 
 * @param query The media query to match against (e.g., "(max-width: 640px)")
 * @returns A boolean indicating whether the media query matches
 */
export function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState<boolean>(() => {
    // Initialize with the current match state if in browser environment
    if (typeof window !== 'undefined') {
      return window.matchMedia(query).matches;
    }
    // Default to false in SSR/non-browser environments
    return false;
  });

  useEffect(() => {
    // Skip in non-browser environments
    if (typeof window === 'undefined') {
      return;
    }

    const mediaQuery = window.matchMedia(query);
    
    // Update the state when the media query changes
    const updateMatches = () => {
      setMatches(mediaQuery.matches);
    };

    // Set the initial value
    updateMatches();

    // Modern browsers
    if (mediaQuery.addEventListener) {
      mediaQuery.addEventListener('change', updateMatches);
      return () => {
        mediaQuery.removeEventListener('change', updateMatches);
      };
    } 
    // Fallback for older browsers
    else if (mediaQuery.addListener) {
      // @ts-ignore - For older browsers that don't have addEventListener
      mediaQuery.addListener(updateMatches);
      return () => {
        // @ts-ignore - For older browsers that don't have removeEventListener
        mediaQuery.removeListener(updateMatches);
      };
    }

    // No cleanup needed if neither method is available
    return undefined;
  }, [query]);

  return matches;
}
