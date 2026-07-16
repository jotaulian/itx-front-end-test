import { act } from 'react'
import { createElement } from 'react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { QueryClientProvider } from '@tanstack/react-query'
import { renderHook } from '@testing-library/react'
import { apiClient } from '@/shared/lib/apiClient.js'
import { useProducts } from '@/product-list/api/useProducts.js'
import { useProduct } from '@/product-detail/api/useProduct.js'
import { queryClient } from './queryClient.js'

// api-cache spec: "1-Hour Cache TTL for Product Reads" and "Revalidation
// After Expiry". These tests exercise the REAL exported `queryClient`
// singleton (not a fresh test-only client) so they prove the actual
// production config — staleTime AND gcTime both 3_600_000 — behaves
// correctly, not just that the numbers are set (already covered by
// queryClient.test.js). Per design.md's own risk callout, the default 5min
// gcTime is SHORTER than the 1h staleTime, so a query that loses all
// observers (e.g. PLP -> PDP -> PLP) would be garbage collected and
// force a refetch before the TTL elapses if gcTime were left at default.
vi.mock('@/shared/lib/apiClient.js', () => ({
  apiClient: vi.fn(),
}))

const ONE_HOUR_MS = 3_600_000
const THIRTY_MIN_MS = 30 * 60 * 1000

function wrapper({ children }) {
  return createElement(QueryClientProvider, { client: queryClient }, children)
}

// Flushes both the fake macrotask queue and the microtasks queued by the
// mocked apiClient promise / TanStack Query's internal notifyManager
// scheduling, so `result.current` reflects the settled query state.
async function flush() {
  await act(async () => {
    await vi.advanceTimersByTimeAsync(0)
  })
}

beforeEach(() => {
  vi.useFakeTimers()
  queryClient.clear()
  apiClient.mockReset()
})

afterEach(() => {
  vi.useRealTimers()
})

describe('api-cache: 1-Hour Cache TTL for Product Reads', () => {
  it('serves ["products"] from cache on remount within 1h — no second network call', async () => {
    const catalog = [{ id: '1', brand: 'Acer', model: 'Liquid Z6' }]
    apiClient.mockResolvedValueOnce(catalog)

    const first = renderHook(() => useProducts(), { wrapper })
    await flush()
    expect(first.result.current.data).toEqual(catalog)
    expect(apiClient).toHaveBeenCalledTimes(1)
    first.unmount()

    await act(async () => {
      await vi.advanceTimersByTimeAsync(THIRTY_MIN_MS)
    })

    const second = renderHook(() => useProducts(), { wrapper })
    await flush()

    expect(second.result.current.data).toEqual(catalog)
    expect(apiClient).toHaveBeenCalledTimes(1)
    second.unmount()
  })

  it('serves ["products", id] from cache on remount within 1h — no second network call', async () => {
    const detail = { id: 'X', brand: 'Acer', model: 'Iconia Talk S' }
    apiClient.mockResolvedValueOnce(detail)

    const first = renderHook(() => useProduct('X'), { wrapper })
    await flush()
    expect(first.result.current.data).toEqual(detail)
    expect(apiClient).toHaveBeenCalledTimes(1)
    first.unmount()

    await act(async () => {
      await vi.advanceTimersByTimeAsync(THIRTY_MIN_MS)
    })

    const second = renderHook(() => useProduct('X'), { wrapper })
    await flush()

    expect(second.result.current.data).toEqual(detail)
    expect(apiClient).toHaveBeenCalledTimes(1)
    second.unmount()
  })
})

describe('api-cache: Revalidation After Expiry', () => {
  // The first observer is deliberately kept mounted for the whole test so
  // the query never loses all observers (which would start the gcTime
  // eviction timer and conflate "evicted then refetched" with the actual
  // behavior under test: a refetch triggered purely because staleTime, not
  // gcTime, elapsed). A second observer mounting on the same key/client
  // simulates "that query is requested again" from the spec scenario.
  it('triggers a refetch and updates the cache when ["products"] is requested again after 1h', async () => {
    const catalogV1 = [{ id: '1', brand: 'Acer', model: 'Liquid Z6' }]
    const catalogV2 = [{ id: '1', brand: 'Acer', model: 'Liquid Z6 (updated)' }]
    apiClient.mockResolvedValueOnce(catalogV1)

    const observer1 = renderHook(() => useProducts(), { wrapper })
    await flush()
    expect(observer1.result.current.data).toEqual(catalogV1)
    expect(apiClient).toHaveBeenCalledTimes(1)

    await act(async () => {
      await vi.advanceTimersByTimeAsync(ONE_HOUR_MS + 60_000)
    })

    apiClient.mockResolvedValueOnce(catalogV2)
    const observer2 = renderHook(() => useProducts(), { wrapper })
    await flush()

    expect(apiClient).toHaveBeenCalledTimes(2)
    expect(observer2.result.current.data).toEqual(catalogV2)

    observer1.unmount()
    observer2.unmount()
  })

  it('triggers a refetch and updates the cache when ["products", id] is requested again after 1h', async () => {
    const detailV1 = { id: 'X', brand: 'Acer', model: 'Iconia Talk S' }
    const detailV2 = { id: 'X', brand: 'Acer', model: 'Iconia Talk S (updated)' }
    apiClient.mockResolvedValueOnce(detailV1)

    const observer1 = renderHook(() => useProduct('X'), { wrapper })
    await flush()
    expect(observer1.result.current.data).toEqual(detailV1)
    expect(apiClient).toHaveBeenCalledTimes(1)

    await act(async () => {
      await vi.advanceTimersByTimeAsync(ONE_HOUR_MS + 60_000)
    })

    apiClient.mockResolvedValueOnce(detailV2)
    const observer2 = renderHook(() => useProduct('X'), { wrapper })
    await flush()

    expect(apiClient).toHaveBeenCalledTimes(2)
    expect(observer2.result.current.data).toEqual(detailV2)

    observer1.unmount()
    observer2.unmount()
  })
})
