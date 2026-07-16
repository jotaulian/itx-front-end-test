import { CircleAlertIcon } from 'lucide-react'
import { Alert, AlertAction, AlertDescription } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'

// Reusable API-failure shell: message + "Reintentar" button that re-invokes
// the caller's retry operation (refetch() for queries, mutate(sameP) for
// the cart mutation). Used by product-list, product-detail and cart.
function ErrorState({ message, onRetry }) {
  return (
    <Alert variant="destructive">
      <CircleAlertIcon data-icon aria-hidden="true" />
      <AlertDescription>{message}</AlertDescription>
      <AlertAction>
        <Button type="button" variant="outline" size="sm" onClick={onRetry}>
          Reintentar
        </Button>
      </AlertAction>
    </Alert>
  )
}

export default ErrorState
