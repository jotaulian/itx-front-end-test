import { describe, expect, it } from 'vitest'
import { filterProducts } from './filterProducts.js'

const catalog = [
  { id: '1', brand: 'Acer', model: 'Liquid Z6', price: '120', imgUrl: 'a.jpg' },
  { id: '2', brand: 'Apple', model: 'iPhone 11', price: '609', imgUrl: 'b.jpg' },
  { id: '3', brand: 'Samsung', model: 'Galaxy S9', price: '', imgUrl: 'c.jpg' },
]

describe('filterProducts', () => {
  it('returns every product when the search string is empty', () => {
    expect(filterProducts(catalog, '')).toEqual(catalog)
  })

  it('matches (case-insensitively) against Marca', () => {
    expect(filterProducts(catalog, 'acer')).toEqual([catalog[0]])
  })

  it('matches (case-insensitively) against Modelo', () => {
    expect(filterProducts(catalog, 'iphone')).toEqual([catalog[1]])
  })

  it('returns an empty array when nothing matches', () => {
    expect(filterProducts(catalog, 'nokia')).toEqual([])
  })
})
