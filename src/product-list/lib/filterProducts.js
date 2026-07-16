// Pure, side-effect-free filter used by ProductListPage's useMemo (design.md:
// "Client-side search via useMemo, not a query"). Matches the search text
// against Marca (brand) OR Modelo (model), case-insensitively.
export function filterProducts(products, search) {
  const query = search.trim().toLowerCase()

  if (!query) {
    return products
  }

  return products.filter(
    ({ brand, model }) =>
      brand.toLowerCase().includes(query) || model.toLowerCase().includes(query),
  )
}
