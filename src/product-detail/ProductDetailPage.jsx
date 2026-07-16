import { useParams } from 'react-router-dom'

// Placeholder page for Phase 4 (PR4: product-detail) — layout, selectors,
// add-to-cart are implemented there. It exists now only so the app-shell
// router (Phase 2) has a real element to mount at "/product/:id".
function ProductDetailPage() {
  const { id } = useParams()

  return <div data-testid="product-detail-page">Product detail {id} (coming in PR4)</div>
}

export default ProductDetailPage
