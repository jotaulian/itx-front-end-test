import { useQuery } from '@tanstack/react-query'
import { apiClient } from '@/shared/lib/apiClient.js'

// Fetches a single product's detail by id. Shares the ['products', id]
// hierarchy under the ['products'] entity key used by useProducts()
// (api-cache spec), with the same 1h staleTime/gcTime/retry defaults.
export function useProduct(id) {
  return useQuery({
    queryKey: ['products', id],
    queryFn: () => apiClient(`/api/product/${id}`),
    enabled: Boolean(id),
  })
}
