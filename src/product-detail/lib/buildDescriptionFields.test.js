import { describe, expect, it } from 'vitest'
import { buildDescriptionFields } from './buildDescriptionFields.js'

const baseProduct = {
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

describe('buildDescriptionFields', () => {
  it('returns all 11 required fields, in order, with values from the product', () => {
    const fields = buildDescriptionFields(baseProduct)

    expect(fields).toEqual([
      { label: 'Marca', value: 'Acer' },
      { label: 'Modelo', value: 'Iconia Talk S' },
      { label: 'Precio', value: '170 €' },
      { label: 'CPU', value: 'Quad-core 1.3 GHz Cortex-A53' },
      { label: 'RAM', value: '2 GB RAM' },
      { label: 'Sistema Operativo', value: 'Android 6.0 (Marshmallow)' },
      { label: 'Resolución de pantalla', value: '7.0 inches (~69.8% screen-to-body ratio)' },
      { label: 'Batería', value: 'Non-removable Li-Ion 3400 mAh battery (12.92 Wh)' },
      { label: 'Cámaras', value: '13 MP, autofocus / 2 MP, 720p' },
      { label: 'Dimensiones', value: '191.7 x 101 x 9.4 mm (7.55 x 3.98 x 0.37 in)' },
      { label: 'Peso', value: '260' },
    ])
  })

  it('falls back to placeholder text for an empty price, single-string camera, and missing weight', () => {
    const fields = buildDescriptionFields({
      ...baseProduct,
      price: '',
      primaryCamera: '13 MP',
      secondaryCmera: undefined,
      weight: undefined,
    })

    const byLabel = Object.fromEntries(fields.map((f) => [f.label, f.value]))
    expect(byLabel.Precio).toBe('Precio no disponible')
    expect(byLabel.Cámaras).toBe('13 MP')
    expect(byLabel.Peso).toBe('No disponible')
  })
})
