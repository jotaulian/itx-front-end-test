import { createElement } from 'react'
import { describe, expect, it, vi } from 'vitest'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { renderHook, waitFor } from '@testing-library/react'
import { apiClient } from '@/shared/lib/apiClient.js'
import { useProduct } from './useProduct.js'

vi.mock('@/shared/lib/apiClient.js', () => ({
  apiClient: vi.fn(),
}))

function createWrapper() {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  })
  return ({ children }) =>
    createElement(QueryClientProvider, { client: queryClient }, children)
}

describe('useProduct', () => {
  it('fetches GET /api/product/:id and exposes the resolved detail', async () => {
    const detail = { id: 'X', brand: 'Acer', model: 'Liquid Z6', price: '120' }
    apiClient.mockResolvedValueOnce(detail)

    const { result } = renderHook(() => useProduct('X'), { wrapper: createWrapper() })

    await waitFor(() => expect(result.current.isSuccess).toBe(true))

    expect(apiClient).toHaveBeenCalledWith('/api/product/X')
    expect(result.current.data).toEqual(detail)
  })

  it('uses the ["products", id] query key and exposes isError on failure', async () => {
    apiClient.mockRejectedValueOnce(new Error('Request to /api/product/X failed with status 500'))

    const { result } = renderHook(() => useProduct('X'), { wrapper: createWrapper() })

    await waitFor(() => expect(result.current.isError).toBe(true))

    expect(result.current.error.message).toBe(
      'Request to /api/product/X failed with status 500',
    )
  })
})
