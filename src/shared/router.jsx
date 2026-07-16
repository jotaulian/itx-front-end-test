import { createBrowserRouter } from 'react-router-dom'
import App from '@/App.jsx'
import ProductListPage from '@/product-list/ProductListPage.jsx'
import ProductDetailPage from '@/product-detail/ProductDetailPage.jsx'

// Route config extracted from the router instance so tests can build their
// own createMemoryRouter from the exact same tree (no duplicated routing).
export const routes = [
  {
    path: '/',
    element: <App />,
    children: [
      { index: true, element: <ProductListPage /> },
      {
        path: 'product/:id',
        element: <ProductDetailPage />,
        // `crumb` is a placeholder until PR4 wires real Marca/Modelo data
        // (e.g. from the cached ['products', id] query). Breadcrumbs only
        // needs a string here — the mechanism does not change in PR4.
        handle: {
          crumb: (params) => `Producto ${params.id}`,
        },
      },
    ],
  },
]

export const router = createBrowserRouter(routes)
