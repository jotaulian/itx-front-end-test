import { describe, expect, it } from 'vitest'
import { render, screen } from '@testing-library/react'
import Empty from './Empty.jsx'

describe('Empty', () => {
  it('renders the given plain-text message', () => {
    render(<Empty message="No hay resultados para tu búsqueda." />)

    expect(screen.getByText('No hay resultados para tu búsqueda.')).toBeInTheDocument()
  })

  it('renders a different message without throwing', () => {
    expect(() => render(<Empty message="El carrito está vacío." />)).not.toThrow()
    expect(screen.getByText('El carrito está vacío.')).toBeInTheDocument()
  })
})
