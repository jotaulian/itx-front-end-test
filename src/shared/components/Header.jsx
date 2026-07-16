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

  return (
    <header className="sticky top-0 z-10 flex items-center justify-between gap-4 border-b bg-background p-4">
      <div className="flex items-center gap-4">
        <Link to="/" className="flex items-center gap-2 text-sm font-semibold">
          <ShoppingBagIcon data-icon aria-hidden="true" />
          <span>ITX Shop</span>
        </Link>
        <Breadcrumbs />
      </div>
      <Badge data-testid="cart-count-badge" className="text-sm [&>svg]:size-4!">
        <ShoppingCartIcon data-icon="inline-start" aria-hidden="true" />
        {count}
      </Badge>
    </header>
  )
}

export default Header
