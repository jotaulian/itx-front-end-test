import { act } from 'react'
import { describe, expect, it } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { RouterProvider, createMemoryRouter } from 'react-router-dom'
import BackToListLink from './BackToListLink.jsx'

function renderAt(path) {
  const router = createMemoryRouter(
    [
      { path: '/', element: <div data-testid="plp">PLP</div> },
      { path: '/product/:id', element: <BackToListLink /> },
    ],
    { initialEntries: [path] },
  )
  render(<RouterProvider router={router} />)
  return router
}

describe('BackToListLink', () => {
  it('renders a link distinct from the breadcrumb, with its own accessible name', () => {
    renderAt('/product/42')

    const link = screen.getByRole('link', { name: /volver al listado/i })
    expect(link).toBeInTheDocument()
    expect(link).not.toHaveAttribute('aria-current')
  })

  it('navigates from the PDP back to / without a full page reload when clicked', async () => {
    const user = userEvent.setup()
    const router = renderAt('/product/42')

    await act(async () => {
      await user.click(screen.getByRole('link', { name: /volver al listado/i }))
    })

    expect(router.state.location.pathname).toBe('/')
    expect(screen.getByTestId('plp')).toBeInTheDocument()
  })
})
