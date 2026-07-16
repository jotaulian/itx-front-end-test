import { Skeleton } from '@/components/ui/skeleton'

// Loading placeholder shown while useProduct(id) is pending. Mirrors the
// PDP's two-column layout (image left, description+actions right) so the
// layout doesn't jump once real data arrives.
function DetailSkeleton() {
  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2" data-testid="detail-skeleton">
      <Skeleton className="aspect-square w-full rounded-xl" />
      <div className="flex flex-col gap-4">
        <Skeleton className="h-6 w-2/3" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-1/2" />
        <Skeleton className="h-8 w-40" />
        <Skeleton className="h-8 w-40" />
        <Skeleton className="h-8 w-24" />
      </div>
    </div>
  )
}

export default DetailSkeleton
