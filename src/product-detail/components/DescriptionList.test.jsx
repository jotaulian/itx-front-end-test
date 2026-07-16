import { describe, expect, it } from 'vitest'
import { render, screen } from '@testing-library/react'
import DescriptionList from './DescriptionList.jsx'

const product = {
  brand: 'Acer',
  model: 'Iconia Talk S',
  price: '170',
  cpu: 'Quad-core 1.3 GHz Cortex-A53',
  ram: '2 GB RAM',
  os: 'Android 6.0 (Marshmallow)',
  displayResolution: '7.0 inches (~69.8% screen-to-body ratio)',
  battery: 'Non-removable Li-Ion 3400 mAh battery (12.92 Wh)',
  primaryCamera: ['13 MP', 'autofocus'],
  secondaryCmera: ['2 MP', '720p'],
  dimentions: '191.7 x 101 x 9.4 mm (7.55 x 3.98 x 0.37 in)',
  weight: '260',
}

describe('DescriptionList', () => {
  it('renders all 11 required fields with their values from the API data', () => {
    render(<DescriptionList product={product} />)

    expect(screen.getByText('Marca')).toBeInTheDocument()
    expect(screen.getByText('Acer')).toBeInTheDocument()
    expect(screen.getByText('Modelo')).toBeInTheDocument()
    expect(screen.getByText('Iconia Talk S')).toBeInTheDocument()
    expect(screen.getByText('Precio')).toBeInTheDocument()
    expect(screen.getByText('170 €')).toBeInTheDocument()
    expect(screen.getByText('CPU')).toBeInTheDocument()
    expect(screen.getByText('Quad-core 1.3 GHz Cortex-A53')).toBeInTheDocument()
    expect(screen.getByText('RAM')).toBeInTheDocument()
    expect(screen.getByText('2 GB RAM')).toBeInTheDocument()
    expect(screen.getByText('Sistema Operativo')).toBeInTheDocument()
    expect(screen.getByText('Android 6.0 (Marshmallow)')).toBeInTheDocument()
    expect(screen.getByText('Resolución de pantalla')).toBeInTheDocument()
    expect(screen.getByText('7.0 inches (~69.8% screen-to-body ratio)')).toBeInTheDocument()
    expect(screen.getByText('Batería')).toBeInTheDocument()
    expect(screen.getByText('Non-removable Li-Ion 3400 mAh battery (12.92 Wh)')).toBeInTheDocument()
    expect(screen.getByText('Cámaras')).toBeInTheDocument()
    expect(screen.getByText('13 MP, autofocus / 2 MP, 720p')).toBeInTheDocument()
    expect(screen.getByText('Dimensiones')).toBeInTheDocument()
    expect(screen.getByText('191.7 x 101 x 9.4 mm (7.55 x 3.98 x 0.37 in)')).toBeInTheDocument()
    expect(screen.getByText('Peso')).toBeInTheDocument()
    expect(screen.getByText('260')).toBeInTheDocument()
  })

  it('renders a different product with a different field count from the same 11-field shape (triangulation)', () => {
    render(
      <DescriptionList
        product={{ ...product, model: 'Liquid Z6 Plus', price: '', weight: undefined }}
      />,
    )

    expect(screen.getByText('Liquid Z6 Plus')).toBeInTheDocument()
    expect(screen.getByText('Precio no disponible')).toBeInTheDocument()
    expect(screen.getByText('No disponible')).toBeInTheDocument()
  })
})
