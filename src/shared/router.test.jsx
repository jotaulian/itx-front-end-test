import { act } from 'react'
import { describe, expect, it } from 'vitest'
import { render, screen } from '@testing-library/react'
import { RouterProvider, createMemoryRouter } from 'react-router-dom'
import { routes } from './router.jsx'

function renderAt(path) {
  const router = createMemoryRouter(routes, { initialEntries: [path] })
  render(<RouterProvider router={router} />)
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
