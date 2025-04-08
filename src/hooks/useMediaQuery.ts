
import { useState, useEffect } from 'react';

/**
 * Hook to detect if the window matches a media query
 * @param query The media query to match
 * @returns Boolean indicating if the query matches
 */
export const useMediaQuery = (query: string): boolean => {
  const [matches, setMatches] = useState(false);
  
  useEffect(() => {
    // Create a MediaQueryList object
    const media = window.matchMedia(query);
    
    // Set initial value
    setMatches(media.matches);
    
    // Define callback function to handle changes
    const listener = (e: MediaQueryListEvent) => setMatches(e.matches);
    
    // Add event listener for changes to the query match
    media.addEventListener('change', listener);
    
    // Clean up function to remove listener when component unmounts
    return () => {
      media.removeEventListener('change', listener);
    };
  }, [query]); // Only re-run if the query changes
  
  return matches;
};
