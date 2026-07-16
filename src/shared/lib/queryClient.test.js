import { describe, expect, it } from 'vitest'
import { queryClient } from './queryClient.js'

describe('queryClient', () => {
  it('caches queries for a full hour (staleTime and gcTime both 1h)', () => {
    const { queries } = queryClient.getDefaultOptions()

    expect(queries.staleTime).toBe(3_600_000)
    expect(queries.gcTime).toBe(3_600_000)
  })

  it('retries a failed query exactly once', () => {
    const { queries } = queryClient.getDefaultOptions()

    expect(queries.retry).toBe(1)
  })
})
