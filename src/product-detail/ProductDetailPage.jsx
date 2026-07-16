import { useMemo, useState } from 'react'
import { useParams } from 'react-router-dom'
import ErrorState from '@/shared/components/ErrorState.jsx'
import { useAddToCart } from '@/cart/api/useAddToCart.js'
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

  // Memoized so the reference only changes when `product` itself changes
  // (not on every render) — required for the render-time sync below to
  // settle instead of looping.
  const colors = useMemo(() => product?.options?.colors ?? [], [product])
  const storages = useMemo(() => product?.options?.storages ?? [], [product])

  const [colorCode, setColorCode] = useState(colors[0]?.code)
  const [storageCode, setStorageCode] = useState(storages[0]?.code)

  // useState's initializer only runs on first mount, but the real
  // useProduct() mounts with isPending:true (colors/storages = []) before
  // resolving on this same component instance — the initializer above locks
  // colorCode/storageCode to undefined forever. Sync the default here once
  // options actually become available, without clobbering a selection the
  // user already made (spec: pre-select a default option, single-option
  // case included). Adjusted directly during render ("Adjusting state when a
  // prop changes" — react.dev), not in a useEffect, so it settles in the
  // same render pass instead of causing an extra commit. Codes are compared
  // via String() because OptionSelector's ToggleGroup reports string values
  // on user selection while colors[]/storages[] carry the raw (often
  // numeric) codes from the API.
  const [syncedColors, setSyncedColors] = useState(colors)
  if (colors !== syncedColors) {
    setSyncedColors(colors)
    if (colors.length > 0 && !colors.some((color) => String(color.code) === String(colorCode))) {
      setColorCode(colors[0].code)
    }
  }

  const [syncedStorages, setSyncedStorages] = useState(storages)
  if (storages !== syncedStorages) {
    setSyncedStorages(storages)
    if (
      storages.length > 0 &&
      !storages.some((storage) => String(storage.code) === String(storageCode))
    ) {
      setStorageCode(storages[0].code)
    }
  }

  // useMutation exposes `variables` as the exact payload from the last
  // mutate() call, and it stays set after an error (until the next mutate).
  // Reintentar resubmits THAT captured payload, not whatever the selectors
  // currently show — the user could have changed the selection between the
  // failed attempt and clicking retry (cart spec: "Reintentar resubmits the
  // same request payload"; JD-004).
  const {
    mutate: addToCart,
    isPending: isAdding,
    isError: isAddError,
    variables: lastAddPayload,
  } = useAddToCart()

  function handleAddToCart(payload) {
    addToCart(payload)
  }

  function handleRetryAddToCart() {
    addToCart(lastAddPayload)
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
              {isAddError && (
                <ErrorState
                  message="No se pudo añadir el producto al carrito."
                  onRetry={handleRetryAddToCart}
                />
              )}
              <AddToCartButton
                id={id}
                colorCode={String(colorCode)}
                storageCode={String(storageCode)}
                isPending={isAdding}
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
