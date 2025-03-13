
import { useRef, useCallback } from "react";

export const useOperationExclusion = () => {
  const operationInProgressRef = useRef(false);
  
  const runExclusiveOperation = useCallback(async (operation: () => Promise<boolean>): Promise<boolean> => {
    if (operationInProgressRef.current) {
      console.log("Operation already in progress, ignoring request");
      return false;
    }

    try {
      operationInProgressRef.current = true;
      return await operation();
    } finally {
      // Säkerställ att flaggan återställs även vid fel
      setTimeout(() => {
        operationInProgressRef.current = false;
      }, 300);
    }
  }, []);

  return { runExclusiveOperation, operationInProgressRef };
};
