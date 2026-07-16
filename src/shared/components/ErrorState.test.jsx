import { describe, expect, it, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import ErrorState from './ErrorState.jsx'

describe('ErrorState', () => {
  it('renders the given error message', () => {
    render(<ErrorState message="No se pudo cargar la información." onRetry={() => {}} />)

    expect(screen.getByText('No se pudo cargar la información.')).toBeInTheDocument()
  })

  it('invokes the retry callback when "Reintentar" is clicked', async () => {
    const onRetry = vi.fn()
    const user = userEvent.setup()
    render(<ErrorState message="Error de red" onRetry={onRetry} />)

    await user.click(screen.getByRole('button', { name: 'Reintentar' }))

    expect(onRetry).toHaveBeenCalledTimes(1)
  })
})
