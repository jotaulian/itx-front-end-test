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
        // `crumb: true` just marks this route as needing a second
        // breadcrumb level; Breadcrumbs derives the actual label (the
        // product's Modelo) from the shared ['products', id] query cache.
        handle: {
          crumb: true,
        },
      },
    ],
  },
]

export const router = createBrowserRouter(routes)
