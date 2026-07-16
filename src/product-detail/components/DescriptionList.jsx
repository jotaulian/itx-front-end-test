import { buildDescriptionFields } from '../lib/buildDescriptionFields.js'

// Renders the 11 required PDP attributes (spec: "Product Description
// Fields") as a semantic description list — label/value pairs, no shadcn
// primitive maps directly onto <dl>/<dt>/<dd> so plain semantic HTML is used
// here per the "use existing components before custom markup" exception for
// native elements with a direct accessible mapping.
function DescriptionList({ product }) {
  const fields = buildDescriptionFields(product)

  return (
    <dl className="grid grid-cols-1 gap-x-4 gap-y-2 sm:grid-cols-2">
      {fields.map(({ label, value }) => (
        <div key={label} className="flex flex-col gap-0.5">
          <dt className="text-sm text-muted-foreground">{label}</dt>
          <dd className="text-sm font-medium">{value}</dd>
        </div>
      ))}
    </dl>
  )
}

export default DescriptionList
