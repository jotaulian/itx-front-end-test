import { useMemo, useState } from 'react'
import Empty from '@/shared/components/Empty.jsx'
import ErrorState from '@/shared/components/ErrorState.jsx'
import { useProducts } from './api/useProducts.js'
import ProductGrid from './components/ProductGrid.jsx'
import ProductGridSkeleton from './components/ProductGridSkeleton.jsx'
import SearchBar from './components/SearchBar.jsx'
import { filterProducts } from './lib/filterProducts.js'

// PLP: fetches the catalog once (useProducts), then filters it locally on
// every keystroke via useMemo — no new query per keystroke, no `select`
// transform (design.md decision).
function ProductListPage() {
  const [search, setSearch] = useState('')
  const { data, isPending, isError, refetch } = useProducts()

  const filteredProducts = useMemo(
    () => filterProducts(data ?? [], search),
    [data, search],
  )

  return (
    <div data-testid="product-list-page" className="flex flex-col gap-8 p-4">
      <SearchBar value={search} onChange={setSearch} />

      {isPending && <ProductGridSkeleton />}

      {!isPending && isError && (
        <ErrorState
          message="No se pudo cargar el catálogo de productos."
          onRetry={refetch}
        />
      )}

      {!isPending && !isError && filteredProducts.length === 0 && (
        <Empty message="No se encontraron productos." />
      )}

      {!isPending && !isError && filteredProducts.length > 0 && (
        <ProductGrid products={filteredProducts} />
      )}
    </div>
  )
}

export default ProductListPage
