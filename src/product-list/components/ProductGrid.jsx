import { Link } from 'react-router-dom'
import ProductCard from './ProductCard.jsx'

// Responsive grid, max 4 items per row on wide viewports, fewer on narrower
// ones (Product Grid Rendering). Each item is a router Link so clicking it
// navigates to the PDP without a full page reload (Navigation to Product
// Detail, task 3.6).
function ProductGrid({ products }) {
  return (
    <ul
      role="list"
      data-testid="product-grid"
      className="grid grid-cols-2 gap-8 sm:grid-cols-3 lg:grid-cols-4"
    >
      {products.map((product) => (
        <li key={product.id}>
          <Link to={`/product/${product.id}`}>
            <ProductCard product={product} />
          </Link>
        </li>
      ))}
    </ul>
  )
}

export default ProductGrid
