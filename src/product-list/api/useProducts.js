import { useQuery } from '@tanstack/react-query'
import { apiClient } from '@/shared/lib/apiClient.js'

// Fetches the full product catalog. staleTime/gcTime/retry come from the
// centrally-configured queryClient defaults (api-cache spec, 1h TTL).
export function useProducts() {
  return useQuery({
    queryKey: ['products'],
    queryFn: () => apiClient('/api/product'),
  })
}
