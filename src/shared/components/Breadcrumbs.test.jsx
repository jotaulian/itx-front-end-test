import { describe, expect, it, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { RouterProvider, createMemoryRouter } from 'react-router-dom'
import { useProduct } from '@/product-detail/api/useProduct.js'
import Breadcrumbs from './Breadcrumbs.jsx'

vi.mock('@/product-detail/api/useProduct.js', () => ({
  useProduct: vi.fn(),
}))

const routes = [
  {
    path: '/',
    element: <Breadcrumbs />,
    children: [
      { index: true },
      {
        path: 'product/:id',
        handle: { crumb: true },
      },
    ],
  },
]

function renderAt(path) {
  const router = createMemoryRouter(routes, { initialEntries: [path] })
  render(<RouterProvider router={router} />)
}

describe('Breadcrumbs', () => {
  it('shows only the root level on the PLP route, with no second segment', () => {
    useProduct.mockReturnValue({ data: undefined })

    renderAt('/')

    const home = screen.getByText('Inicio')
    expect(home).toHaveAttribute('aria-current', 'page')
    expect(home).not.toHaveAttribute('href')
    expect(screen.queryByText('Producto')).not.toBeInTheDocument()
  })

  it('falls back to a generic label while the product is still loading', () => {
    useProduct.mockReturnValue({ data: undefined })

    renderAt('/product/42')

    const homeLink = screen.getByRole('link', { name: 'Inicio' })
    expect(homeLink).toHaveAttribute('href', '/')
    expect(screen.getByText('Producto')).toBeInTheDocument()
  })

  it('shows the product Modelo once it loads, instead of the raw id', () => {
    useProduct.mockReturnValue({ data: { model: 'Iconia Talk S' } })

    renderAt('/product/42')

    expect(screen.getByText('Iconia Talk S')).toBeInTheDocument()
    expect(screen.queryByText('42')).not.toBeInTheDocument()
  })
})
