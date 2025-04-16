
import { useSessionState } from "./auth/useSessionState";
import { useTokenRefresh } from "./auth/useTokenRefresh";
import { useSignOut } from "./auth/useSignOut";

export const useSession = () => {
  const { session, isLoading, user, setSession } = useSessionState();
  const { refreshTimerRef } = useTokenRefresh(session, setSession);
  const { signOut } = useSignOut(); // Remove the refreshTimerRef argument

  return {
    session,
    isLoading,
    user,
    signOut
  };
};
