import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { ShoppingBagIcon, ShoppingCartIcon } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { useCart } from '@/cart/useCart.js'
import Breadcrumbs from './Breadcrumbs.jsx'

// Rendered by the App layout route on every view. Cart count is read from
// the app-wide CartContext (cart spec: "App-Wide Count Exposure via
// Context") instead of being threaded down as a prop. The badge is a
// passive display only — no onClick — per the spec's "No Dedicated Cart
// View" requirement (clicking it must not open any cart UI).
function Header() {
  const { count } = useCart()
  const [isAtTop, setIsAtTop] = useState(true)

  // The breadcrumb row is only meaningful context right at the top of the
  // page — once scrolled, a semi-see-through strip over the grid reads as
  // a rendering glitch rather than navigation, so it's hidden instead.
  useEffect(() => {
    function handleScroll() {
      setIsAtTop(window.scrollY === 0)
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <header className="sticky top-0 z-10 bg-background">
      <div className="flex items-center justify-between gap-4 border-b p-4">
        <Link to="/" className="flex items-center gap-2 text-sm font-semibold">
          <ShoppingBagIcon data-icon aria-hidden="true" />
          <span>ITX Shop</span>
        </Link>
        <Badge data-testid="cart-count-badge" className="text-sm [&>svg]:size-4!">
          <ShoppingCartIcon data-icon="inline-start" aria-hidden="true" />
          {count}
        </Badge>
      </div>
      <div
        data-testid="breadcrumb-row"
        className={`overflow-hidden px-4 transition-[max-height,opacity] duration-200 ${
          isAtTop ? 'max-h-12 py-2 opacity-100' : 'max-h-0 py-0 opacity-0'
        }`}
      >
        <Breadcrumbs />
      </div>
    </header>
  )
}

export default Header
