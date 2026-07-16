import { describe, expect, it, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { CartProvider } from './CartContext.jsx'
import { useCart } from './useCart.js'

const STORAGE_KEY = 'cartCount'

function CartConsumer() {
  const { count, setCount } = useCart()
  return (
    <div>
      <span data-testid="count">{count}</span>
      <button type="button" onClick={() => setCount(5)}>
        set
      </button>
    </div>
  )
}

beforeEach(() => {
  localStorage.clear()
})

describe('CartProvider / useCart', () => {
  it('lazy-initializes count from localStorage on mount', () => {
    localStorage.setItem(STORAGE_KEY, '7')

    render(
      <CartProvider>
        <CartConsumer />
      </CartProvider>,
    )

    expect(screen.getByTestId('count')).toHaveTextContent('7')
  })

  it('defaults to 0 when localStorage has no stored count', () => {
    render(
      <CartProvider>
        <CartConsumer />
      </CartProvider>,
    )

    expect(screen.getByTestId('count')).toHaveTextContent('0')
  })

  it('exposes setCount so any consumer can update the count', async () => {
    const user = userEvent.setup()
    render(
      <CartProvider>
        <CartConsumer />
      </CartProvider>,
    )

    await user.click(screen.getByRole('button', { name: 'set' }))

    expect(screen.getByTestId('count')).toHaveTextContent('5')
  })

  it('persists the updated count to localStorage on setCount (Cart Count Persistence)', async () => {
    const user = userEvent.setup()
    render(
      <CartProvider>
        <CartConsumer />
      </CartProvider>,
    )

    await user.click(screen.getByRole('button', { name: 'set' }))

    expect(localStorage.getItem(STORAGE_KEY)).toBe('5')
  })

  it('carries the persisted count over to a fresh mount (reload simulation)', async () => {
    const user = userEvent.setup()
    const { unmount } = render(
      <CartProvider>
        <CartConsumer />
      </CartProvider>,
    )

    await user.click(screen.getByRole('button', { name: 'set' }))
    unmount()

    render(
      <CartProvider>
        <CartConsumer />
      </CartProvider>,
    )

    expect(screen.getByTestId('count')).toHaveTextContent('5')
  })

  it('throws a clear error when useCart is used outside a CartProvider', () => {
    function Bare() {
      useCart()
      return null
    }

    expect(() => render(<Bare />)).toThrow(/CartProvider/)
  })
})
