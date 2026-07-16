import { describe, expect, it } from 'vitest'
import { render, screen } from '@testing-library/react'
import { RouterProvider, createMemoryRouter } from 'react-router-dom'
import Header from './Header.jsx'

const routes = [
  { path: '/', element: <Header cartCount={3} /> },
  { path: '/product/:id', element: <Header cartCount={3} /> },
]

function renderAt(path) {
  const router = createMemoryRouter(routes, { initialEntries: [path] })
  render(<RouterProvider router={router} />)
}

describe('Header', () => {
  it('links the title/icon back to the product list route', () => {
    renderAt('/product/42')

    const homeLink = screen.getByRole('link', { name: /itx shop/i })
    expect(homeLink).toHaveAttribute('href', '/')
  })

  it('shows the cart count badge on the PLP route', () => {
    renderAt('/')

    expect(screen.getByTestId('cart-count-badge')).toHaveTextContent('3')
  })

  it('shows the cart count badge in the same position on the PDP route', () => {
    renderAt('/product/42')

    expect(screen.getByTestId('cart-count-badge')).toHaveTextContent('3')
  })
})
