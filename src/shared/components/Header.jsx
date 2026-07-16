import { Link } from 'react-router-dom'
import { ShoppingBagIcon } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import Breadcrumbs from './Breadcrumbs.jsx'

// Rendered by the App layout route on every view. cartCount defaults to 0 so
// this component works standalone before PR5 wires the real CartContext.
function Header({ cartCount = 0 }) {
  return (
    <header className="flex items-center justify-between gap-4 border-b p-4">
      <div className="flex items-center gap-4">
        <Link to="/" className="flex items-center gap-2 text-sm font-semibold">
          <ShoppingBagIcon data-icon aria-hidden="true" />
          <span>ITX Shop</span>
        </Link>
        <Breadcrumbs />
      </div>
      <Badge data-testid="cart-count-badge">{cartCount}</Badge>
    </header>
  )
}

export default Header
