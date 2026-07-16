import { Skeleton } from '@/components/ui/skeleton'

const PLACEHOLDER_COUNT = 8

// Loading placeholder shown while useProducts() is pending. Mirrors
// ProductGrid's responsive grid so the layout doesn't jump once real data
// arrives.
function ProductGridSkeleton() {
  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4" data-testid="product-grid-skeleton">
      {Array.from({ length: PLACEHOLDER_COUNT }).map((_, index) => (
        <Skeleton key={index} className="aspect-[3/4] w-full rounded-xl" />
      ))}
    </div>
  )
}

export default ProductGridSkeleton
