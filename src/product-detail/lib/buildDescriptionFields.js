// Pure formatting helper: the /api/product/:id payload sometimes returns an
// empty string for `price` (same as the catalog list) and camera fields as
// either a string or an array depending on the item — normalized here so
// DescriptionList never has to branch on shape.
function formatValue(value) {
  if (Array.isArray(value)) return value.join(', ')
  return value || 'No disponible'
}

function formatPrice(price) {
  return price ? `${price} €` : 'Precio no disponible'
}

function formatCameras(product) {
  const primary = product.primaryCamera ? formatValue(product.primaryCamera) : ''
  const secondary = product.secondaryCmera ? formatValue(product.secondaryCmera) : ''

  if (primary && secondary) return `${primary} / ${secondary}`
  return primary || secondary || 'No disponible'
}

// Builds the 11 required PDP description fields (spec: "Product Description
// Fields") from the raw /api/product/:id payload, in display order.
export function buildDescriptionFields(product) {
  return [
    { label: 'Marca', value: formatValue(product.brand) },
    { label: 'Modelo', value: formatValue(product.model) },
    { label: 'Precio', value: formatPrice(product.price) },
    { label: 'CPU', value: formatValue(product.cpu) },
    { label: 'RAM', value: formatValue(product.ram) },
    { label: 'Sistema Operativo', value: formatValue(product.os) },
    { label: 'Resolución de pantalla', value: formatValue(product.displayResolution) },
    { label: 'Batería', value: formatValue(product.battery) },
    { label: 'Cámaras', value: formatCameras(product) },
    { label: 'Dimensiones', value: formatValue(product.dimentions) },
    { label: 'Peso', value: formatValue(product.weight) },
  ]
}
