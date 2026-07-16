import { createElement } from 'react'
import { describe, expect, it, vi } from 'vitest'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { renderHook, waitFor } from '@testing-library/react'
import { apiClient } from '@/shared/lib/apiClient.js'
import { useProducts } from './useProducts.js'

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

describe('useProducts', () => {
  it('fetches GET /api/product and exposes the resolved catalog', async () => {
    const catalog = [
      { id: '1', brand: 'Acer', model: 'Liquid Z6', price: '120', imgUrl: 'a.jpg' },
    ]
    apiClient.mockResolvedValueOnce(catalog)

    const { result } = renderHook(() => useProducts(), { wrapper: createWrapper() })

    await waitFor(() => expect(result.current.isSuccess).toBe(true))

    expect(apiClient).toHaveBeenCalledWith('/api/product')
    expect(result.current.data).toEqual(catalog)
  })

  it('uses the ["products"] query key and exposes isError on failure', async () => {
    apiClient.mockRejectedValueOnce(new Error('Request to /api/product failed with status 500'))

    const { result } = renderHook(() => useProducts(), { wrapper: createWrapper() })

    await waitFor(() => expect(result.current.isError).toBe(true))

    expect(result.current.error.message).toBe(
      'Request to /api/product failed with status 500',
    )
  })
})
