
import { useState, useRef, useEffect } from "react";
import { Salon } from "@/components/admin/types";

/**
 * Hook for managing salon list state
 */
export const useSalonState = () => {
  const [editingSalon, setEditingSalon] = useState<Salon | null>(null);
  const [deletingSalon, setDeletingSalon] = useState<Salon | null>(null);
  const [selectedSalon, setSelectedSalon] = useState<Salon | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [ratingSalon, setRatingSalon] = useState<Salon | null>(null);
  const [isRating, setIsRating] = useState(false);
  
  // Reference to track if component is mounted
  const isMountedRef = useRef(true);
  
  // Setup mount tracking
  useEffect(() => {
    isMountedRef.current = true;
    console.log("[useSalonState] Hook initialized");
    
    return () => { 
      console.log("[useSalonState] Hook cleanup");
      isMountedRef.current = false; 
    };
  }, []);

  // Safe state setter for component unmount protection
  const safeSetState = <T,>(setter: React.Dispatch<React.SetStateAction<T>>, value: T) => {
    if (isMountedRef.current) {
      setter(value);
    }
  };

  return {
    // State values
    editingSalon,
    deletingSalon,
    selectedSalon,
    isCreating,
    ratingSalon,
    isRating,
    
    // State setters (with safe setState wrapper)
    setEditingSalon: (salon: Salon | null) => safeSetState(setEditingSalon, salon),
    setDeletingSalon: (salon: Salon | null) => safeSetState(setDeletingSalon, salon),
    setSelectedSalon: (salon: Salon | null) => safeSetState(setSelectedSalon, salon),
    setIsCreating: (value: boolean) => safeSetState(setIsCreating, value),
    setRatingSalon: (salon: Salon | null) => safeSetState(setRatingSalon, salon),
    setIsRating: (value: boolean) => safeSetState(setIsRating, value),
    
    // Utility
    isMountedRef
  };
};
