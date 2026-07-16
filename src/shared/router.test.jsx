import { act } from 'react'
import { describe, expect, it, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { QueryClientProvider } from '@tanstack/react-query'
import { RouterProvider, createMemoryRouter } from 'react-router-dom'
import { queryClient } from './lib/queryClient.js'
import { routes } from './router.jsx'

// The real ProductListPage (PR3) fetches via useProducts(), so this
// router-only test needs a QueryClientProvider ancestor. It mocks
// apiClient so no real network call happens here — that behavior is
// covered by useProducts.test.js and ProductListPage.test.jsx.
vi.mock('@/shared/lib/apiClient.js', () => ({
  apiClient: vi.fn().mockResolvedValue([]),
}))

function renderAt(path) {
  const router = createMemoryRouter(routes, { initialEntries: [path] })
  render(
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
    </QueryClientProvider>,
  )
  return router
}

describe('router', () => {
  it('renders the product list route at /', () => {
    renderAt('/')

    expect(screen.getByTestId('product-list-page')).toBeInTheDocument()
  })

  it('navigates from / to /product/:id, updating the URL with no full page reload', async () => {
    const router = renderAt('/')

    await act(async () => {
      await router.navigate('/product/42')
    })

    expect(router.state.location.pathname).toBe('/product/42')
    expect(screen.getByTestId('product-detail-page')).toBeInTheDocument()
    expect(screen.queryByTestId('product-list-page')).not.toBeInTheDocument()
  })
})
