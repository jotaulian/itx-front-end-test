import {
  Empty as EmptyRoot,
  EmptyContent,
  EmptyDescription,
} from '@/components/ui/empty'

// Reusable empty-result shell: plain-text message, no broken layout. Used by
// product-list (no search matches) and, per JD-006, must live alongside
// ErrorState in shared/components/ rather than under a single feature folder.
function Empty({ message }) {
  return (
    <EmptyRoot>
      <EmptyContent>
        <EmptyDescription>{message}</EmptyDescription>
      </EmptyContent>
    </EmptyRoot>
  )
}

export default Empty
