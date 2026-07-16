import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

// Pure formatting helper: the catalog API sometimes returns an empty string
// for `price` (confirmed against GET /api/product), so the grid must not
// render a bare "€" for those items.
export function formatPrice(price) {
  return price ? `${price} €` : 'Precio no disponible'
}

// Presentational card for a single catalog item: image, Modelo (title),
// Marca (description) and Precio. Navigation to the PDP is handled by the
// parent ProductGrid (the card itself has no routing concerns).
function ProductCard({ product }) {
  const { brand, model, price, imgUrl } = product

  return (
    <Card>
      <CardHeader>
        <img
          src={imgUrl}
          alt={`${brand} ${model}`}
          className="aspect-square w-full rounded-md object-cover"
        />
        <CardTitle>{model}</CardTitle>
        <CardDescription>{brand}</CardDescription>
      </CardHeader>
      <CardContent>{formatPrice(price)}</CardContent>
    </Card>
  )
}

export default ProductCard
