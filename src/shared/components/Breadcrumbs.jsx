import { Link, useMatches } from 'react-router-dom'
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb'

// Max two levels: root (Inicio) and, when matched, the current route's crumb
// label (declared per-route via `handle.crumb` in shared/router.jsx).
function Breadcrumbs() {
  const matches = useMatches()
  const currentLabel = matches
    .filter((match) => typeof match.handle?.crumb === 'function')
    .map((match) => match.handle.crumb(match.params))
    .at(-1)

  return (
    <Breadcrumb>
      <BreadcrumbList>
        <BreadcrumbItem>
          {currentLabel ? (
            <BreadcrumbLink render={<Link to="/" />}>Inicio</BreadcrumbLink>
          ) : (
            <BreadcrumbPage>Inicio</BreadcrumbPage>
          )}
        </BreadcrumbItem>
        {currentLabel ? (
          <>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>{currentLabel}</BreadcrumbPage>
            </BreadcrumbItem>
          </>
        ) : null}
      </BreadcrumbList>
    </Breadcrumb>
  )
}

export default Breadcrumbs
