import { Button } from '@/components/ui/button'
import { Spinner } from '@/components/ui/spinner'

// PR4 scope only: this button TRIGGERS add-to-cart by calling the
// `onAddToCart` payload built from current selector state — it does NOT
// perform the POST /api/cart mutation itself. The real `useAddToCart`
// TanStack mutation is cart's job (PR5); wiring it here now would force
// PR5 to rip it back out. `isPending` is likewise just a prop passed down
// from whichever parent eventually owns the mutation.
function AddToCartButton({ id, colorCode, storageCode, isPending, onAddToCart }) {
  function handleClick() {
    onAddToCart({ id, colorCode, storageCode })
  }

  return (
    <Button type="button" onClick={handleClick} disabled={isPending}>
      {isPending && <Spinner data-icon="inline-start" />}
      Añadir
    </Button>
  )
}

export default AddToCartButton
