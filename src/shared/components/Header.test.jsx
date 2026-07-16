import { describe, expect, it, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { RouterProvider, createMemoryRouter } from 'react-router-dom'
import { CartProvider } from '@/cart/CartContext.jsx'
import Header from './Header.jsx'

const routes = [
  { path: '/', element: <Header /> },
  { path: '/product/:id', element: <Header /> },
]

function renderAt(path) {
  const router = createMemoryRouter(routes, { initialEntries: [path] })
  const queryClient = new QueryClient()
  render(
    <QueryClientProvider client={queryClient}>
      <CartProvider>
        <RouterProvider router={router} />
      </CartProvider>
    </QueryClientProvider>,
  )
}

beforeEach(() => {
  localStorage.clear()
  localStorage.setItem('cartCount', '3')
})

describe('Header', () => {
  it('links the title/icon back to the product list route', () => {
    renderAt('/product/42')

    const homeLink = screen.getByRole('link', { name: /itx shop/i })
    expect(homeLink).toHaveAttribute('href', '/')
  })

  it('shows the cart count badge on the PLP route, sourced from CartContext', () => {
    renderAt('/')

    expect(screen.getByTestId('cart-count-badge')).toHaveTextContent('3')
  })

  it('shows the cart count badge in the same position on the PDP route', () => {
    renderAt('/product/42')

    expect(screen.getByTestId('cart-count-badge')).toHaveTextContent('3')
  })

  it('has no cart-opening behavior when the count badge is clicked (No Dedicated Cart View)', async () => {
    const user = userEvent.setup()
    renderAt('/')

    await user.click(screen.getByTestId('cart-count-badge'))

    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
    expect(screen.getByTestId('cart-count-badge')).toHaveTextContent('3')
  })
})
