import { ArrowLeftIcon } from 'lucide-react'
import { Link } from 'react-router-dom'
import { buttonVariants } from '@/components/ui/button'
import { cn } from '@/lib/utils'

// Back-to-list navigation trigger (spec: "Back Navigation to PLP"). This is
// the JD-001 fix from the design review: it must be visually/structurally
// distinct from the header Breadcrumb (a <nav><ol><li> list) — implemented
// as a standalone element, not another breadcrumb item.
//
// A plain router `Link` styled with the Button "link" variant is used
// instead of wrapping it in the `Button` component: base-ui's `Button`
// primitive forces `role="button"` on its rendered element even when
// composed via `render`+`nativeButton={false}` onto an `<a>` (confirmed
// empirically), which would hide this from the accessibility tree as a
// link. This IS a link (client-side navigation), so it keeps native link
// semantics and only borrows the Button variant's visual styling.
function BackToListLink() {
  return (
    <Link
      to="/"
      className={cn(
        buttonVariants({ variant: 'link' }),
        'w-fit px-0 text-muted-foreground has-data-[icon=inline-start]:pl-0',
      )}
    >
      <ArrowLeftIcon data-icon="inline-start" />
      Volver al listado
    </Link>
  )
}

export default BackToListLink
