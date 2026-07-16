import { QueryClient } from '@tanstack/react-query'

// Single, centrally-configured QueryClient. staleTime AND gcTime must both be
// 1h: the default gcTime (5min) is shorter than the required 1h staleTime, so
// a query that loses all observers (e.g. PLP -> PDP -> PLP) would be garbage
// collected and refetched before the TTL elapses, violating the api-cache spec.
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 3_600_000,
      gcTime: 3_600_000,
      retry: 1,
    },
  },
})
