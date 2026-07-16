import { Link, useMatches } from 'react-router-dom'
import { useProduct } from '@/product-detail/api/useProduct.js'
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb'

// Max two levels: root (Inicio) and, when matched, the current product's
// Modelo (declared per-route via `handle.crumb: true` in shared/router.jsx).
// The label comes from the shared ['products', id] query cache — the same
// entry ProductDetailPage reads — so this never fires a second request.
function Breadcrumbs() {
  const matches = useMatches()
  const productMatch = matches.find((match) => match.handle?.crumb)
  const id = productMatch?.params?.id
  const { data: product } = useProduct(id)
  const currentLabel = productMatch ? (product?.model ?? 'Producto') : null

  return (
    <Breadcrumb>
      <BreadcrumbList>
        <BreadcrumbItem>
          {currentLabel ? (
            <BreadcrumbLink render={<Link to="/" />}>Inicio</BreadcrumbLink>
          ) : (
            <BreadcrumbPage>Inicio</BreadcrumbPage>
          )}
        </BreadcrumbItem>
        {currentLabel ? (
          <>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>{currentLabel}</BreadcrumbPage>
            </BreadcrumbItem>
          </>
        ) : null}
      </BreadcrumbList>
    </Breadcrumb>
  )
}

export default Breadcrumbs
