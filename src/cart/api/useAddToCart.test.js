import { createElement } from 'react'
import { describe, expect, it, vi, beforeEach } from 'vitest'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { renderHook, waitFor } from '@testing-library/react'
import { apiClient } from '@/shared/lib/apiClient.js'
import { CartProvider } from '../CartContext.jsx'
import { useCart } from '../useCart.js'
import { useAddToCart } from './useAddToCart.js'

vi.mock('@/shared/lib/apiClient.js', () => ({
  apiClient: vi.fn(),
}))

function createWrapper() {
  const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } })
  return ({ children }) =>
    createElement(
      QueryClientProvider,
      { client: queryClient },
      createElement(CartProvider, null, children),
    )
}

function useHarness() {
  const cart = useCart()
  const mutation = useAddToCart()
  return { cart, mutation }
}

beforeEach(() => {
  localStorage.clear()
  apiClient.mockReset()
})

describe('useAddToCart', () => {
  it('POSTs the exact {id, colorCode, storageCode} payload to /api/cart', async () => {
    apiClient.mockResolvedValueOnce({ count: 3 })
    const { result } = renderHook(() => useAddToCart(), { wrapper: createWrapper() })

    result.current.mutate({ id: 'X', colorCode: '1000', storageCode: '2000' })

    await waitFor(() => expect(result.current.isSuccess).toBe(true))

    expect(apiClient).toHaveBeenCalledWith(
      '/api/cart',
      expect.objectContaining({
        method: 'POST',
        body: JSON.stringify({ id: 'X', colorCode: '1000', storageCode: '2000' }),
      }),
    )
  })

  it('does not retry a failed request (retry: 0, avoids double-adding to cart)', async () => {
    apiClient.mockRejectedValue(new Error('boom'))
    const { result } = renderHook(() => useAddToCart(), { wrapper: createWrapper() })

    result.current.mutate({ id: 'X', colorCode: '1000', storageCode: '2000' })

    await waitFor(() => expect(result.current.isError).toBe(true))

    expect(apiClient).toHaveBeenCalledTimes(1)
  })

  it('overwrites the cart count from the response on success, never increments locally', async () => {
    localStorage.setItem('cartCount', '2')
    apiClient.mockResolvedValueOnce({ count: 9 })

    const { result } = renderHook(() => useHarness(), { wrapper: createWrapper() })

    expect(result.current.cart.count).toBe(2)

    result.current.mutation.mutate({ id: 'X', colorCode: '1000', storageCode: '2000' })

    await waitFor(() => expect(result.current.cart.count).toBe(9))
  })

  it('leaves the stored count unchanged on failure, with no unhandled rejection', async () => {
    localStorage.setItem('cartCount', '2')
    apiClient.mockRejectedValue(new Error('network down'))

    const { result } = renderHook(() => useHarness(), { wrapper: createWrapper() })

    result.current.mutation.mutate({ id: 'X', colorCode: '1000', storageCode: '2000' })

    await waitFor(() => expect(result.current.mutation.isError).toBe(true))

    expect(result.current.cart.count).toBe(2)
    expect(localStorage.getItem('cartCount')).toBe('2')
  })
})
