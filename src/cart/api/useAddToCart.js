import { useMutation } from '@tanstack/react-query'
import { apiClient } from '@/shared/lib/apiClient.js'
import { useCart } from '../useCart.js'

// POSTs the add-to-cart payload. retry: 0 (mutations must not auto-retry —
// an automatic retry on a transient POST /api/cart failure risks
// double-adding the item, per design.md). onSuccess OVERWRITES the stored
// count from the response's {count} — never increments locally (cart spec:
// "Server Count as Source of Truth").
export function useAddToCart() {
  const { setCount } = useCart()

  return useMutation({
    mutationFn: ({ id, colorCode, storageCode }) =>
      apiClient('/api/cart', {
        method: 'POST',
        body: JSON.stringify({ id, colorCode, storageCode }),
      }),
    retry: 0,
    onSuccess: (data) => {
      setCount(data.count)
    },
  })
}
