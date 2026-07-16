import { describe, expect, it, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import AddToCartButton from './AddToCartButton.jsx'

describe('AddToCartButton', () => {
  it('calls onAddToCart with {id, colorCode, storageCode} built from the current selector state on click', async () => {
    const user = userEvent.setup()
    const onAddToCart = vi.fn()
    render(
      <AddToCartButton
        id="X"
        colorCode="1000"
        storageCode="2001"
        isPending={false}
        onAddToCart={onAddToCart}
      />,
    )

    await user.click(screen.getByRole('button', { name: /añadir/i }))

    expect(onAddToCart).toHaveBeenCalledTimes(1)
    expect(onAddToCart).toHaveBeenCalledWith({ id: 'X', colorCode: '1000', storageCode: '2001' })
  })

  it('sends a different payload when the selector state differs (triangulation)', async () => {
    const user = userEvent.setup()
    const onAddToCart = vi.fn()
    render(
      <AddToCartButton
        id="Y"
        colorCode="1001"
        storageCode="2000"
        isPending={false}
        onAddToCart={onAddToCart}
      />,
    )

    await user.click(screen.getByRole('button', { name: /añadir/i }))

    expect(onAddToCart).toHaveBeenCalledWith({ id: 'Y', colorCode: '1001', storageCode: '2000' })
  })

  it('shows a Spinner and disables the button when isPending is true (JD-005 composition, not ad hoc props)', () => {
    render(
      <AddToCartButton
        id="X"
        colorCode="1000"
        storageCode="2001"
        isPending
        onAddToCart={() => {}}
      />,
    )

    const button = screen.getByRole('button', { name: /añadir/i })
    expect(button).toBeDisabled()
    expect(button.querySelector('[data-icon="inline-start"][data-slot="spinner"]')).toBeInTheDocument()
  })
})
