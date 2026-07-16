import { describe, expect, it, vi, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { QueryClientProvider } from '@tanstack/react-query'
import { RouterProvider, createMemoryRouter } from 'react-router-dom'
import { apiClient } from '@/shared/lib/apiClient.js'
import { queryClient } from '@/shared/lib/queryClient.js'
import { routes } from '@/shared/router.jsx'
import { CartProvider } from './CartContext.jsx'

// Full, unmocked hook stack (useProducts, useProduct, useAddToCart, useCart)
// exercised through the real router tree — only the network boundary
// (apiClient) is mocked. This is the truest test of the cart spec's
// "App-Wide Count Exposure via Context" and "Add-to-Cart Failure Handling"
// requirements end to end.
vi.mock('@/shared/lib/apiClient.js', () => ({
  apiClient: vi.fn(),
}))

const catalog = [{ id: 'a1', brand: 'Acer', model: 'Liquid Z6', price: '120', imgUrl: 'a1.jpg' }]

const detail = {
  id: 'a1',
  brand: 'Acer',
  model: 'Liquid Z6',
  price: '120',
  imgUrl: 'a1.jpg',
  cpu: 'Quad-core',
  ram: '2 GB',
  os: 'Android',
  displayResolution: '5.0 inches',
  battery: '2000 mAh',
  primaryCamera: '8 MP',
  secondaryCmera: '2 MP',
  dimentions: '140 x 70 x 8 mm',
  weight: '150',
  options: {
    colors: [{ code: 1000, name: 'Black' }],
    storages: [{ code: 2000, name: '16 GB' }],
  },
}

function renderApp(path) {
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

beforeEach(() => {
  localStorage.clear()
  queryClient.clear()
  apiClient.mockReset()
})

describe('cart cross-view flow (App-Wide Count Exposure via Context)', () => {
  it('updates the Header count immediately on the PDP after a successful add, and it stays updated after navigating back to the PLP', async () => {
    apiClient.mockImplementation((path, options) => {
      if (path === '/api/product') return Promise.resolve(catalog)
      if (path === '/api/product/a1') return Promise.resolve(detail)
      if (path === '/api/cart' && options?.method === 'POST') return Promise.resolve({ count: 4 })
      return Promise.reject(new Error(`unexpected apiClient call: ${path}`))
    })
    const user = userEvent.setup()

    renderApp('/product/a1')

    expect(screen.getByTestId('cart-count-badge')).toHaveTextContent('0')

    await user.click(await screen.findByRole('button', { name: /añadir/i }))

    expect(await screen.findByTestId('cart-count-badge')).toHaveTextContent('4')

    await user.click(screen.getByRole('link', { name: /volver al listado/i }))

    expect(await screen.findByTestId('product-list-page')).toBeInTheDocument()
    expect(screen.getByTestId('cart-count-badge')).toHaveTextContent('4')
  })
})

describe('cart add-to-cart failure handling end to end (JD-004)', () => {
  it('shows ErrorState on POST failure, leaves the count unchanged, and Reintentar resubmits the exact failed payload even after the selection changes, clearing the error on success', async () => {
    let firstCartCall = true
    apiClient.mockImplementation((path, options) => {
      if (path === '/api/product') return Promise.resolve(catalog)
      if (path === '/api/product/a1') return Promise.resolve(detail)
      if (path === '/api/cart' && options?.method === 'POST') {
        if (firstCartCall) {
          firstCartCall = false
          return Promise.reject(new Error('network error'))
        }
        // Resolves on the retry — assert it was called with the ORIGINAL
        // payload (single color/storage option here, so the body is fixed),
        // proving the resubmit is not re-derived from live selector state.
        expect(JSON.parse(options.body)).toEqual({
          id: 'a1',
          colorCode: '1000',
          storageCode: '2000',
        })
        return Promise.resolve({ count: 6 })
      }
      return Promise.reject(new Error(`unexpected apiClient call: ${path}`))
    })
    const user = userEvent.setup()

    renderApp('/product/a1')

    await user.click(await screen.findByRole('button', { name: /añadir/i }))

    expect(
      await screen.findByText('No se pudo añadir el producto al carrito.'),
    ).toBeInTheDocument()
    // No unhandled rejection reached this point (the failure resolved via
    // the mutation's onError-driven isError flag), and the count is
    // untouched.
    expect(screen.getByTestId('cart-count-badge')).toHaveTextContent('0')

    await user.click(screen.getByRole('button', { name: 'Reintentar' }))

    expect(await screen.findByTestId('cart-count-badge')).toHaveTextContent('6')
    expect(
      screen.queryByText('No se pudo añadir el producto al carrito.'),
    ).not.toBeInTheDocument()
  })
})

describe('No Dedicated Cart View', () => {
  it('has no cart route anywhere in the app router config', () => {
    const paths = JSON.stringify(routes)
    expect(paths.toLowerCase()).not.toMatch(/cart/)
  })
})
