import { describe, expect, it } from 'vitest'
import { render, screen } from '@testing-library/react'
import { RouterProvider, createMemoryRouter } from 'react-router-dom'
import Breadcrumbs from './Breadcrumbs.jsx'

const routes = [
  {
    path: '/',
    element: <Breadcrumbs />,
    children: [
      { index: true },
      {
        path: 'product/:id',
        handle: { crumb: (params) => `Producto ${params.id}` },
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
    renderAt('/')

    const home = screen.getByText('Inicio')
    expect(home).toHaveAttribute('aria-current', 'page')
    expect(home).not.toHaveAttribute('href')
    expect(screen.queryByText(/^Producto /)).not.toBeInTheDocument()
  })

  it('shows a linked root level plus the current product on the PDP route', () => {
    renderAt('/product/42')

    const homeLink = screen.getByRole('link', { name: 'Inicio' })
    expect(homeLink).toHaveAttribute('href', '/')
    expect(screen.getByText('Producto 42')).toBeInTheDocument()
  })
})
