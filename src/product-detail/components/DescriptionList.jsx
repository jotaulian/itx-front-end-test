import { Separator } from '@/components/ui/separator'
import { buildDescriptionFields } from '../lib/buildDescriptionFields.js'

// Renders the 11 required PDP attributes (spec: "Product Description
// Fields"). Marca + Modelo + Precio are pulled out into a hero heading
// above the fold — separated from the rest of the technical spec grid by a
// Separator — since brand/model/price read as the product's identity, not
// just another spec row. The remaining 8 fields stay a semantic <dl>; no
// shadcn primitive maps directly onto <dl>/<dt>/<dd>, so plain semantic
// HTML is used there per the "use existing components before custom
// markup" exception for native elements with a direct accessible mapping.
function DescriptionList({ product }) {
  const fields = buildDescriptionFields(product)
  const heroLabels = new Set(['Marca', 'Modelo', 'Precio'])
  const nameFields = fields.filter(({ label }) => label === 'Marca' || label === 'Modelo')
  const specFields = fields.filter(({ label }) => !heroLabels.has(label))
  const price = fields.find(({ label }) => label === 'Precio')?.value

  return (
    <div data-testid="description" className="flex flex-col gap-4">
      <div>
        <p className="text-xl font-extrabold uppercase">
          {product.brand} - {product.model}
        </p>
        <p className="text-muted-foreground">
          <span className="sr-only">Precio </span>
          {price}
        </p>
      </div>

      <Separator />

      <dl className="grid grid-cols-1 gap-x-4 gap-y-2 sm:grid-cols-2">
        {specFields.map(({ label, value }) => (
          <div key={label} className="flex flex-col gap-0.5">
            <dt className="text-sm text-muted-foreground">{label}</dt>
            <dd className="text-sm font-medium">{value}</dd>
          </div>
        ))}
      </dl>

      {/* Marca/Modelo stay in the DOM (spec: all 11 fields must be present)
          but visually hidden — the hero heading above already shows this
          same data combined into one line. Precio doesn't need this: its
          own line above carries an inline sr-only label instead. */}
      <dl className="sr-only">
        {nameFields.map(({ label, value }) => (
          <div key={label}>
            <dt>{label}</dt>
            <dd>{value}</dd>
          </div>
        ))}
      </dl>
    </div>
  )
}

export default DescriptionList
