
/**
 * Hook to detect if we're in a sandbox or development environment
 */
export const useEnvironmentDetection = () => {
  // Function to check if we're in a sandbox environment
  const isSandboxEnvironment = (): boolean => {
    return window.location.hostname.includes('lovableproject.com') || 
           window.location.hostname.includes('localhost') ||
           window.location.hostname.includes('127.0.0.1');
  };

  return {
    isSandboxEnvironment
  };
};
