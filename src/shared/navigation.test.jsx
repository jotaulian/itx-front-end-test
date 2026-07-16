import { describe, expect, it, vi, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { QueryClientProvider } from '@tanstack/react-query'
import { RouterProvider, createMemoryRouter } from 'react-router-dom'
import { CartProvider } from '@/cart/CartContext.jsx'
import { queryClient } from './lib/queryClient.js'
import { routes } from './router.jsx'

// JD-007 (design review, review-ledger.md): design.md's Testing Strategy
// table had no rows for app-shell routing/navigation scenarios. This file
// closes that gap with real, click-driven navigation coverage through the
// FULL routing tree (App layout + Header + Breadcrumbs + PLP + PDP), rather
// than the programmatic router.navigate() already covered by
// shared/router.test.jsx. Only apiClient is mocked — everything else is
// the real production wiring (app-shell spec: "Client-Side Routing",
// "Shared Header with Home Link", "Breadcrumbs").
const catalog = [{ id: 'a1', brand: 'Acer', model: 'Liquid Z6', price: '120', imgUrl: 'a1.jpg' }]

const productDetail = {
  id: 'a1',
  brand: 'Acer',
  model: 'Liquid Z6',
  price: '120',
  imgUrl: 'a1.jpg',
  options: {
    colors: [{ code: 1000, name: 'Black' }],
    storages: [{ code: 2000, name: '16 GB' }],
  },
}

vi.mock('@/shared/lib/apiClient.js', () => ({
  apiClient: vi.fn((path) =>
    path === '/api/product' ? Promise.resolve(catalog) : Promise.resolve(productDetail),
  ),
}))

function renderAt(path) {
  const router = createMemoryRouter(routes, { initialEntries: [path] })
  render(
    <QueryClientProvider client={queryClient}>
      <CartProvider>
        <RouterProvider router={router} />
      </CartProvider>
    </QueryClientProvider>,
  )
  return router
}

beforeEach(() => {
  queryClient.clear()
})

describe('app-shell navigation (JD-007 coverage)', () => {
  it('navigates from the PLP to the PDP when a product card is clicked', async () => {
    const user = userEvent.setup()
    const router = renderAt('/')

    const image = await screen.findByRole('img', { name: 'Acer Liquid Z6' })
    await user.click(image)

    expect(router.state.location.pathname).toBe('/product/a1')
    expect(await screen.findByTestId('product-detail-page')).toBeInTheDocument()
  })

  it('navigates from the PDP back to the PLP when BackToListLink is clicked', async () => {
    const user = userEvent.setup()
    const router = renderAt('/product/a1')

    const backLink = await screen.findByRole('link', { name: /volver al listado/i })
    await user.click(backLink)

    expect(router.state.location.pathname).toBe('/')
    expect(await screen.findByTestId('product-list-page')).toBeInTheDocument()
  })

  it('navigates from the PDP back to the PLP when the header title/icon is clicked', async () => {
    const user = userEvent.setup()
    const router = renderAt('/product/a1')

    await screen.findByTestId('product-detail-page')
    await user.click(screen.getByRole('link', { name: /itx shop/i }))

    expect(router.state.location.pathname).toBe('/')
    expect(await screen.findByTestId('product-list-page')).toBeInTheDocument()
  })

  it('navigates from the PDP back to the PLP when the breadcrumb root link is clicked', async () => {
    const user = userEvent.setup()
    const router = renderAt('/product/a1')

    await screen.findByTestId('product-detail-page')
    await user.click(screen.getByRole('link', { name: 'Inicio' }))

    expect(router.state.location.pathname).toBe('/')
    expect(await screen.findByTestId('product-list-page')).toBeInTheDocument()
  })
})
