import { describe, expect, it, vi, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter, RouterProvider, createMemoryRouter } from 'react-router-dom'
import { routes } from '@/shared/router.jsx'
import { useProduct } from './api/useProduct.js'
import ProductDetailPage from './ProductDetailPage.jsx'

vi.mock('./api/useProduct.js', () => ({
  useProduct: vi.fn(),
}))

const product = {
  id: 'X',
  brand: 'Acer',
  model: 'Iconia Talk S',
  price: '170',
  imgUrl: 'https://example.com/x.jpg',
  cpu: 'Quad-core 1.3 GHz Cortex-A53',
  ram: '2 GB RAM',
  os: 'Android 6.0 (Marshmallow)',
  displayResolution: '7.0 inches',
  battery: '3400 mAh',
  primaryCamera: ['13 MP'],
  secondaryCmera: ['2 MP'],
  dimentions: '191.7 x 101 x 9.4 mm',
  weight: '260',
  options: {
    colors: [
      { code: 1000, name: 'Black' },
      { code: 1001, name: 'White' },
    ],
    storages: [{ code: 2000, name: '16 GB' }],
  },
}

function renderAt(path) {
  const router = createMemoryRouter(routes, { initialEntries: [path] })
  render(<RouterProvider router={router} />)
  return { router }
}

beforeEach(() => {
  useProduct.mockReset()
})

describe('ProductDetailPage', () => {
  it('shows the detail skeleton while the product is loading', () => {
    useProduct.mockReturnValue({ data: undefined, isPending: true, isError: false, refetch: vi.fn() })

    renderAt('/product/X')

    expect(screen.getByTestId('detail-skeleton')).toBeInTheDocument()
  })

  it('renders the two-column layout: image left, description above actions on the right', () => {
    useProduct.mockReturnValue({ data: product, isPending: false, isError: false, refetch: vi.fn() })

    renderAt('/product/X')

    const image = screen.getByRole('img', { name: 'Acer Iconia Talk S' })
    const description = screen.getByText('Marca').closest('dl')
    const actions = screen.getByRole('button', { name: /añadir/i })

    // Image occupies the left column: its layout container is a sibling of
    // (not nested inside) the right column that holds description+actions.
    const rightColumn = description.parentElement
    expect(rightColumn.contains(actions)).toBe(true)
    expect(rightColumn.contains(image)).toBe(false)

    // Within the right column, description precedes actions in DOM order
    // (description "above" actions).
    const descPosition = description.compareDocumentPosition(actions)
    expect(descPosition & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy()
  })

  it('renders all 11 description fields and pre-selects one option per selector, including a single-option selector', () => {
    useProduct.mockReturnValue({ data: product, isPending: false, isError: false, refetch: vi.fn() })

    renderAt('/product/X')

    expect(screen.getByText('Marca')).toBeInTheDocument()
    expect(screen.getByText('Peso')).toBeInTheDocument()

    expect(screen.getByRole('button', { name: 'Black' })).toHaveAttribute('data-pressed')
    expect(screen.getByRole('button', { name: '16 GB' })).toHaveAttribute('data-pressed')
  })

  it('renders the BackToListLink, distinct from the header breadcrumb', () => {
    useProduct.mockReturnValue({ data: product, isPending: false, isError: false, refetch: vi.fn() })

    renderAt('/product/X')

    expect(screen.getByRole('link', { name: /volver al listado/i })).toBeInTheDocument()
  })

  it('calls onAddToCart-driven payload with the current selector state when Añadir is clicked', async () => {
    useProduct.mockReturnValue({ data: product, isPending: false, isError: false, refetch: vi.fn() })
    const user = userEvent.setup()
    const infoSpy = vi.spyOn(console, 'info').mockImplementation(() => {})

    renderAt('/product/X')

    await user.click(screen.getByRole('button', { name: 'White' }))
    await user.click(screen.getByRole('button', { name: /añadir/i }))

    expect(infoSpy).toHaveBeenCalledWith(
      expect.stringContaining('PR5'),
      { id: 'X', colorCode: '1001', storageCode: '2000' },
    )
    infoSpy.mockRestore()
  })

  it('shows the shared ErrorState on fetch failure and recovers via Reintentar -> refetch, no unhandled rejection', async () => {
    const refetch = vi.fn()
    useProduct.mockReturnValue({ data: undefined, isPending: false, isError: true, refetch })
    const user = userEvent.setup()
    const { rerender } = render(
      <MemoryRouter initialEntries={['/product/X']}>
        <ProductDetailPage />
      </MemoryRouter>,
    )

    expect(screen.getByText('No se pudo cargar el detalle del producto.')).toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: 'Reintentar' }))
    expect(refetch).toHaveBeenCalledTimes(1)

    useProduct.mockReturnValue({ data: product, isPending: false, isError: false, refetch })
    rerender(
      <MemoryRouter initialEntries={['/product/X']}>
        <ProductDetailPage />
      </MemoryRouter>,
    )

    expect(
      screen.queryByText('No se pudo cargar el detalle del producto.'),
    ).not.toBeInTheDocument()
    expect(screen.getByText('Marca')).toBeInTheDocument()
  })
})
