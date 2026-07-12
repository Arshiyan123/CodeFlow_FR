import { useHealthCheck } from '@workspace/api-client-react';

/**
 * Reports whether the backend/API server is reachable. The app must remain
 * fully usable when this is false -- practice, theming, and sound settings
 * are all pure client-side features. Only cross-device sync (session
 * history, stats, leaderboard) depends on this.
 */
export function useBackendStatus() {
  const { isError, isLoading, isSuccess } = useHealthCheck({
    query: {
      retry: 1,
      retryDelay: 1000,
      staleTime: 15000,
      refetchInterval: 30000,
      refetchOnWindowFocus: false,
    },
  });

  return {
    isOnline: isSuccess,
    isChecking: isLoading,
    isOffline: isError,
  };
}
