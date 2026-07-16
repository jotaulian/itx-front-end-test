import { useContext } from 'react'
import { CartContext } from './CartContext.jsx'

// Consumer hook for CartContext. Throws when used outside a CartProvider so
// misconfiguration fails loudly instead of silently reading `undefined`.
export function useCart() {
  const context = useContext(CartContext)
  if (!context) {
    throw new Error('useCart must be used within a CartProvider')
  }
  return context
}
