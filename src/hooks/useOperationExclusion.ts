
import { useState, useRef, useCallback } from "react";

/**
 * Hook för att hantera exklusiva operationer som inte ska kunna köras samtidigt
 */
export const useOperationExclusion = () => {
  const [isOperationInProgress, setIsOperationInProgress] = useState(false);
  const operationTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const clearOperationTimeout = useCallback(() => {
    if (operationTimeoutRef.current) {
      clearTimeout(operationTimeoutRef.current);
      operationTimeoutRef.current = null;
    }
  }, []);

  /**
   * Kör en operation exklusivt, vilket förhindrar att andra operationer startas
   * medan den här körs
   */
  const runExclusiveOperation = useCallback(async <T>(
    operation: () => Promise<T>,
    timeoutMs: number = 5000
  ): Promise<T | null> => {
    if (isOperationInProgress) {
      console.log("Operation already in progress, ignoring new operation");
      return null;
    }

    try {
      setIsOperationInProgress(true);
      clearOperationTimeout();

      // Sätt en timeout för att återställa flaggan om operationen hänger sig
      operationTimeoutRef.current = setTimeout(() => {
        console.warn("Operation timed out, resetting flag");
        setIsOperationInProgress(false);
      }, timeoutMs);

      const result = await operation();
      return result;
    } catch (error) {
      console.error("Error in exclusive operation:", error);
      return null;
    } finally {
      clearOperationTimeout();
      
      // Liten fördröjning för att förhindra snabba upprepade klick
      setTimeout(() => {
        setIsOperationInProgress(false);
      }, 300);
    }
  }, [isOperationInProgress, clearOperationTimeout]);

  return {
    isOperationInProgress,
    runExclusiveOperation
  };
};
