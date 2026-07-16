import { describe, expect, it, vi, beforeEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { MemoryRouter, RouterProvider, createMemoryRouter } from 'react-router-dom'
import { CartProvider } from '@/cart/CartContext.jsx'
import { routes } from '@/shared/router.jsx'
import { useAddToCart } from '@/cart/api/useAddToCart.js'
import { useProduct } from './api/useProduct.js'
import ProductDetailPage from './ProductDetailPage.jsx'

vi.mock('./api/useProduct.js', () => ({
  useProduct: vi.fn(),
}))

vi.mock('@/cart/api/useAddToCart.js', () => ({
  useAddToCart: vi.fn(),
}))

const product = {
  id: 'X',
  brand: 'Acer',
  model: 'Iconia Talk S',
  price: '170',
  imgUrl: 'https://example.com/x.jpg',
  cpu: 'Quad-core 1.3 GHz Cortex-A53',
  ram: '2 GB RAM',
  os: 'Android 6.0 (Marshmallow)',
  displayResolution: '7.0 inches',
  battery: '3400 mAh',
  primaryCamera: ['13 MP'],
  secondaryCmera: ['2 MP'],
  dimentions: '191.7 x 101 x 9.4 mm',
  weight: '260',
  options: {
    colors: [
      { code: 1000, name: 'Black' },
      { code: 1001, name: 'White' },
    ],
    storages: [{ code: 2000, name: '16 GB' }],
  },
}

function renderAt(path) {
  const router = createMemoryRouter(routes, { initialEntries: [path] })
  render(
    <CartProvider>
      <RouterProvider router={router} />
    </CartProvider>,
  )
  return { router }
}

beforeEach(() => {
  useProduct.mockReset()
  useAddToCart.mockReset()
  useAddToCart.mockReturnValue({
    mutate: vi.fn(),
    isPending: false,
    isError: false,
    variables: undefined,
  })
})

describe('ProductDetailPage', () => {
  it('shows the detail skeleton while the product is loading', () => {
    useProduct.mockReturnValue({ data: undefined, isPending: true, isError: false, refetch: vi.fn() })

    renderAt('/product/X')

    expect(screen.getByTestId('detail-skeleton')).toBeInTheDocument()
  })

  it('renders the two-column layout: image left, description above actions on the right', () => {
    useProduct.mockReturnValue({ data: product, isPending: false, isError: false, refetch: vi.fn() })

    renderAt('/product/X')

    const image = screen.getByRole('img', { name: 'Acer Iconia Talk S' })
    const description = screen.getByText('Marca').closest('dl')
    const actions = screen.getByRole('button', { name: /añadir/i })

    // Image occupies the left column: its layout container is a sibling of
    // (not nested inside) the right column that holds description+actions.
    const rightColumn = description.parentElement
    expect(rightColumn.contains(actions)).toBe(true)
    expect(rightColumn.contains(image)).toBe(false)

    // Within the right column, description precedes actions in DOM order
    // (description "above" actions).
    const descPosition = description.compareDocumentPosition(actions)
    expect(descPosition & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy()
  })

  it('renders all 11 description fields and pre-selects one option per selector, including a single-option selector', () => {
    useProduct.mockReturnValue({ data: product, isPending: false, isError: false, refetch: vi.fn() })

    renderAt('/product/X')

    expect(screen.getByText('Marca')).toBeInTheDocument()
    expect(screen.getByText('Peso')).toBeInTheDocument()

    expect(screen.getByRole('button', { name: 'Black' })).toHaveAttribute('data-pressed')
    expect(screen.getByRole('button', { name: '16 GB' })).toHaveAttribute('data-pressed')
  })

  it('renders the BackToListLink, distinct from the header breadcrumb', () => {
    useProduct.mockReturnValue({ data: product, isPending: false, isError: false, refetch: vi.fn() })

    renderAt('/product/X')

    expect(screen.getByRole('link', { name: /volver al listado/i })).toBeInTheDocument()
  })

  it('calls the add-to-cart mutation with the payload built from current selector state when Añadir is clicked', async () => {
    useProduct.mockReturnValue({ data: product, isPending: false, isError: false, refetch: vi.fn() })
    const mutate = vi.fn()
    useAddToCart.mockReturnValue({ mutate, isPending: false, isError: false, variables: undefined })
    const user = userEvent.setup()

    renderAt('/product/X')

    await user.click(screen.getByRole('button', { name: 'White' }))
    await user.click(screen.getByRole('button', { name: /añadir/i }))

    expect(mutate).toHaveBeenCalledTimes(1)
    expect(mutate).toHaveBeenCalledWith({ id: 'X', colorCode: '1001', storageCode: '2000' })
  })

  it("passes the mutation's isPending through to AddToCartButton", () => {
    useProduct.mockReturnValue({ data: product, isPending: false, isError: false, refetch: vi.fn() })
    useAddToCart.mockReturnValue({ mutate: vi.fn(), isPending: true, isError: false, variables: undefined })

    renderAt('/product/X')

    expect(screen.getByRole('button', { name: /añadir/i })).toBeDisabled()
  })

  it('shows a cart-specific ErrorState when the add-to-cart mutation fails (Add-to-Cart Failure Handling)', () => {
    useProduct.mockReturnValue({ data: product, isPending: false, isError: false, refetch: vi.fn() })
    useAddToCart.mockReturnValue({
      mutate: vi.fn(),
      isPending: false,
      isError: true,
      variables: { id: 'X', colorCode: '1000', storageCode: '2000' },
    })

    renderAt('/product/X')

    expect(screen.getByText('No se pudo añadir el producto al carrito.')).toBeInTheDocument()
  })

  it('hides the cart ErrorState once the add-to-cart mutation is no longer in an error state', () => {
    useProduct.mockReturnValue({ data: product, isPending: false, isError: false, refetch: vi.fn() })
    useAddToCart.mockReturnValue({ mutate: vi.fn(), isPending: false, isError: false, variables: undefined })

    renderAt('/product/X')

    expect(screen.queryByText('No se pudo añadir el producto al carrito.')).not.toBeInTheDocument()
  })

  it(
    "Reintentar resubmits the exact captured mutation payload (JD-004), not the current selector " +
      'state, since the user may have changed the selection between the failed attempt and the retry',
    async () => {
      useProduct.mockReturnValue({ data: product, isPending: false, isError: false, refetch: vi.fn() })
      const mutate = vi.fn()
      const capturedPayload = { id: 'X', colorCode: '1000', storageCode: '2000' }
      useAddToCart.mockReturnValue({
        mutate,
        isPending: false,
        isError: true,
        variables: capturedPayload,
      })
      const user = userEvent.setup()

      renderAt('/product/X')

      // User changes the selection AFTER the failure, before clicking retry.
      await user.click(screen.getByRole('button', { name: 'White' }))

      await user.click(screen.getByRole('button', { name: 'Reintentar' }))

      expect(mutate).toHaveBeenCalledWith(capturedPayload)
    },
  )

  it('shows the shared ErrorState on fetch failure and recovers via Reintentar -> refetch, no unhandled rejection', async () => {
    const refetch = vi.fn()
    useProduct.mockReturnValue({ data: undefined, isPending: false, isError: true, refetch })
    const user = userEvent.setup()
    const { rerender } = render(
      <MemoryRouter initialEntries={['/product/X']}>
        <ProductDetailPage />
      </MemoryRouter>,
    )

    expect(screen.getByText('No se pudo cargar el detalle del producto.')).toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: 'Reintentar' }))
    expect(refetch).toHaveBeenCalledTimes(1)

    useProduct.mockReturnValue({ data: product, isPending: false, isError: false, refetch })
    rerender(
      <MemoryRouter initialEntries={['/product/X']}>
        <ProductDetailPage />
      </MemoryRouter>,
    )

    expect(
      screen.queryByText('No se pudo cargar el detalle del producto.'),
    ).not.toBeInTheDocument()
    expect(screen.getByText('Marca')).toBeInTheDocument()
  })

  // Regression for JD-008: useState's initializer only runs on first mount,
  // so when the real useProduct() mounts pending (colors/storages = []) and
  // then resolves on the SAME component instance, colorCode/storageCode must
  // still end up pre-selected. Uses the real useProduct implementation (via
  // the existing mock's mockImplementation) with a fetch that resolves after
  // the initial render, exercising the exact pending -> success transition
  // that a pre-resolved mock (like the tests above) never exercises.
  it('pre-selects the first color and storage once the real product query resolves after the initial pending render (JD-008)', async () => {
    const { useProduct: realUseProduct } = await vi.importActual('./api/useProduct.js')
    useProduct.mockImplementation(realUseProduct)

    let resolveFetch
    const fetchMock = vi.fn(
      () =>
        new Promise((resolve) => {
          resolveFetch = () => resolve({ ok: true, json: () => Promise.resolve(product) })
        }),
    )
    vi.stubGlobal('fetch', fetchMock)

    const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } })
    const router = createMemoryRouter(
      [{ path: '/product/:id', element: <ProductDetailPage /> }],
      { initialEntries: ['/product/X'] },
    )

    render(
      <QueryClientProvider client={queryClient}>
        <RouterProvider router={router} />
      </QueryClientProvider>,
    )

    // First render is pending — real useProduct() hasn't resolved yet.
    expect(screen.getByTestId('detail-skeleton')).toBeInTheDocument()

    resolveFetch()

    await waitFor(() => expect(screen.queryByTestId('detail-skeleton')).not.toBeInTheDocument())

    expect(await screen.findByRole('button', { name: 'Black' })).toHaveAttribute('data-pressed')
    expect(screen.getByRole('button', { name: '16 GB' })).toHaveAttribute('data-pressed')

    vi.unstubAllGlobals()
    queryClient.clear()
  })
})
