import { describe, expect, it, vi, beforeEach } from 'vitest'
import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { QueryClientProvider } from '@tanstack/react-query'
import { MemoryRouter, RouterProvider, createMemoryRouter } from 'react-router-dom'
import { CartProvider } from '@/cart/CartContext.jsx'
import { queryClient } from '@/shared/lib/queryClient.js'
import { routes } from '@/shared/router.jsx'
import { useProducts } from './api/useProducts.js'
import ProductListPage from './ProductListPage.jsx'

vi.mock('./api/useProducts.js', () => ({
  useProducts: vi.fn(),
}))

// The real ProductDetailPage (PR4) mounts on navigation to /product/:id and
// calls the real (unmocked) useProduct(), which needs a QueryClientProvider
// ancestor. Mock apiClient so no real network call happens in this
// navigation-only test — same fix applied to shared/router.test.jsx in PR3
// when the real ProductListPage replaced its own placeholder.
vi.mock('@/shared/lib/apiClient.js', () => ({
  apiClient: vi.fn().mockResolvedValue({}),
}))

const catalog = [
  { id: 'a1', brand: 'Acer', model: 'Liquid Z6', price: '120', imgUrl: 'a1.jpg' },
  { id: 'b2', brand: 'Apple', model: 'iPhone 11', price: '609', imgUrl: 'b2.jpg' },
]

function renderAt(path) {
  const router = createMemoryRouter(routes, { initialEntries: [path] })
  render(
    <QueryClientProvider client={queryClient}>
      <CartProvider>
        <RouterProvider router={router} />
      </CartProvider>
    </QueryClientProvider>,
  )
  return { router }
}

function productGridItems() {
  return within(screen.getByTestId('product-grid')).getAllByRole('listitem')
}

beforeEach(() => {
  useProducts.mockReset()
})

describe('ProductListPage', () => {
  it('shows the grid skeleton while the catalog is loading', () => {
    useProducts.mockReturnValue({
      data: undefined,
      isPending: true,
      isError: false,
      refetch: vi.fn(),
    })

    renderAt('/')

    expect(screen.getByTestId('product-grid-skeleton')).toBeInTheDocument()
  })

  it('filters the grid by Marca/Modelo on every keystroke, no submit required', async () => {
    useProducts.mockReturnValue({
      data: catalog,
      isPending: false,
      isError: false,
      refetch: vi.fn(),
    })
    const user = userEvent.setup()
    renderAt('/')

    expect(productGridItems()).toHaveLength(2)

    await user.type(screen.getByRole('searchbox'), 'iphone')

    const items = productGridItems()
    expect(items).toHaveLength(1)
    expect(within(items[0]).getByText('iPhone 11')).toBeInTheDocument()
    // useProducts() is called with no arguments on every render: the search
    // text never becomes part of the queryKey/queryFn (design.md decision —
    // filtering is a local useMemo, not a new query per keystroke).
    for (const call of useProducts.mock.calls) {
      expect(call).toEqual([])
    }
  })

  it('renders the shared Empty state on zero matches, keeping the input editable', async () => {
    useProducts.mockReturnValue({
      data: catalog,
      isPending: false,
      isError: false,
      refetch: vi.fn(),
    })
    const user = userEvent.setup()

    expect(() => renderAt('/')).not.toThrow()

    const input = screen.getByRole('searchbox')
    await user.type(input, 'nokia')

    expect(screen.getByText('No se encontraron productos.')).toBeInTheDocument()
    expect(screen.queryByTestId('product-grid')).not.toBeInTheDocument()
    expect(input).toBeEnabled()

    await user.type(input, '{backspace}')
    expect(input).toHaveValue('noki')
  })

  it('navigates to /product/:id without a full page reload when a card is clicked', async () => {
    useProducts.mockReturnValue({
      data: catalog,
      isPending: false,
      isError: false,
      refetch: vi.fn(),
    })
    const user = userEvent.setup()
    const { router } = renderAt('/')

    await user.click(screen.getByRole('img', { name: 'Apple iPhone 11' }))

    expect(router.state.location.pathname).toBe('/product/b2')
    expect(screen.getByTestId('product-detail-page')).toBeInTheDocument()
  })

  it('shows the shared ErrorState on fetch failure and recovers via Reintentar -> refetch', async () => {
    const refetch = vi.fn()
    useProducts.mockReturnValue({
      data: undefined,
      isPending: false,
      isError: true,
      refetch,
    })
    const user = userEvent.setup()
    const { rerender } = render(
      <MemoryRouter>
        <ProductListPage />
      </MemoryRouter>,
    )

    expect(
      screen.getByText('No se pudo cargar el catálogo de productos.'),
    ).toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: 'Reintentar' }))
    expect(refetch).toHaveBeenCalledTimes(1)

    // Simulates GET /api/product succeeding after the retry: TanStack Query
    // would notify useProducts' observers and trigger this same re-render in
    // the real app (that reactivity is react-query's own responsibility,
    // already covered by useProducts.test.js).
    useProducts.mockReturnValue({
      data: catalog,
      isPending: false,
      isError: false,
      refetch,
    })
    rerender(
      <MemoryRouter>
        <ProductListPage />
      </MemoryRouter>,
    )

    expect(
      screen.queryByText('No se pudo cargar el catálogo de productos.'),
    ).not.toBeInTheDocument()
    expect(productGridItems()).toHaveLength(2)
  })
})
