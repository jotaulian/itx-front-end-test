import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { QueryClientProvider } from '@tanstack/react-query'
import { RouterProvider } from 'react-router-dom'
import { queryClient } from '@/shared/lib/queryClient.js'
import { router } from '@/shared/router.jsx'
import './index.css'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      {/* PR5 wraps RouterProvider in <CartProvider> here (src/cart/CartContext.jsx).
          No other restructuring needed: it slots directly between the two
          providers already in place. */}
      <RouterProvider router={router} />
    </QueryClientProvider>
  </StrictMode>,
)
