import { createContext, useState } from 'react'

// Key under which the cart count is persisted (cart spec: "Cart Count
// Persistence" — must survive a page reload).
export const CART_COUNT_STORAGE_KEY = 'cartCount'

export const CartContext = createContext(undefined)

function readStoredCount() {
  const stored = Number(localStorage.getItem(CART_COUNT_STORAGE_KEY))
  return Number.isFinite(stored) && stored > 0 ? stored : 0
}

// App-wide cart count, exposed via Context so any view (PLP, PDP) can read
// it without prop drilling (cart spec: "App-Wide Count Exposure via
// Context"). `count` is the server-response value, never a local increment
// (design.md: "Server Count as Source of Truth"); `setCount` both updates
// the in-memory value and persists it, so callers never persist separately.
export function CartProvider({ children }) {
  // Lazy initializer: reads localStorage only once, on first mount.
  const [count, setCountState] = useState(() => readStoredCount())

  function setCount(nextCount) {
    setCountState(nextCount)
    localStorage.setItem(CART_COUNT_STORAGE_KEY, String(nextCount))
  }

  return <CartContext.Provider value={{ count, setCount }}>{children}</CartContext.Provider>
}
