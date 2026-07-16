import { useState } from 'react'
import { useParams } from 'react-router-dom'
import ErrorState from '@/shared/components/ErrorState.jsx'
import { useProduct } from './api/useProduct.js'
import AddToCartButton from './components/AddToCartButton.jsx'
import BackToListLink from './components/BackToListLink.jsx'
import DescriptionList from './components/DescriptionList.jsx'
import DetailSkeleton from './components/DetailSkeleton.jsx'
import OptionSelector from './components/OptionSelector.jsx'

// PDP: fetches the product by id, then renders the two-column layout (spec:
// "Two-Column Layout") — image left, description above actions on the
// right — with storage/color selectors and the add-to-cart trigger.
function ProductDetailPage() {
  const { id } = useParams()
  const { data: product, isPending, isError, refetch } = useProduct(id)

  const colors = product?.options?.colors ?? []
  const storages = product?.options?.storages ?? []

  const [colorCode, setColorCode] = useState(colors[0]?.code)
  const [storageCode, setStorageCode] = useState(storages[0]?.code)

  // Real POST /api/cart mutation wiring lands in PR5 (cart's
  // useAddToCart) — this button only triggers the action for now, mirroring
  // App.jsx's cartCount={0} placeholder pattern until the real dependency
  // exists.
  function handleAddToCart(payload) {
    console.info('Add to cart (placeholder until PR5 wires useAddToCart):', payload)
  }

  return (
    <div data-testid="product-detail-page" className="flex flex-col gap-4 p-4">
      <BackToListLink />

      {isPending && <DetailSkeleton />}

      {!isPending && isError && (
        <ErrorState message="No se pudo cargar el detalle del producto." onRetry={refetch} />
      )}

      {!isPending && !isError && product && (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <img
            src={product.imgUrl}
            alt={`${product.brand} ${product.model}`}
            className="aspect-square w-full rounded-xl object-cover"
          />

          <div className="flex flex-col gap-6">
            <DescriptionList product={product} />

            <div className="flex flex-col gap-4">
              <OptionSelector
                label="Almacenamiento"
                options={storages}
                value={storageCode}
                onChange={setStorageCode}
              />
              <OptionSelector label="Color" options={colors} value={colorCode} onChange={setColorCode} />
              <AddToCartButton
                id={id}
                colorCode={String(colorCode)}
                storageCode={String(storageCode)}
                isPending={false}
                onAddToCart={handleAddToCart}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default ProductDetailPage
