import { describe, expect, it } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import ProductGrid from './ProductGrid.jsx'

const twoProducts = [
  { id: 'a1', brand: 'Acer', model: 'Liquid Z6', price: '120', imgUrl: 'a1.jpg' },
  { id: 'b2', brand: 'Apple', model: 'iPhone 11', price: '609', imgUrl: 'b2.jpg' },
]

function renderGrid(products) {
  return render(
    <MemoryRouter>
      <ProductGrid products={products} />
    </MemoryRouter>,
  )
}

describe('ProductGrid', () => {
  it('renders one card per product showing image, Marca, Modelo and Precio', () => {
    renderGrid(twoProducts)

    const items = screen.getAllByRole('listitem')
    expect(items).toHaveLength(2)

    expect(screen.getByRole('img', { name: 'Acer Liquid Z6' })).toHaveAttribute('src', 'a1.jpg')
    expect(screen.getByText('Liquid Z6')).toBeInTheDocument()
    expect(screen.getByText('Acer')).toBeInTheDocument()
    expect(screen.getByText('120 €')).toBeInTheDocument()

    expect(screen.getByRole('img', { name: 'Apple iPhone 11' })).toHaveAttribute('src', 'b2.jpg')
    expect(screen.getByText('iPhone 11')).toBeInTheDocument()
    expect(screen.getByText('609 €')).toBeInTheDocument()
  })

  it('renders a fallback price label when the API returns an empty price', () => {
    renderGrid([
      { id: 'c3', brand: 'Acer', model: 'Liquid Jade 2', price: '', imgUrl: 'c3.jpg' },
    ])

    expect(screen.getAllByRole('listitem')).toHaveLength(1)
    expect(screen.getByText('Precio no disponible')).toBeInTheDocument()
  })
})
