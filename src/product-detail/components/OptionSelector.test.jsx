import { describe, expect, it, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import OptionSelector from './OptionSelector.jsx'

const twoOptions = [
  { code: 1000, name: 'Black' },
  { code: 1001, name: 'White' },
]

const sevenOptions = Array.from({ length: 7 }, (_, i) => ({ code: 3000 + i, name: `Opt ${i}` }))
const eightOptions = Array.from({ length: 8 }, (_, i) => ({ code: 4000 + i, name: `Opt ${i}` }))

describe('OptionSelector', () => {
  it('renders and pre-selects the single option when there is only one', () => {
    render(
      <OptionSelector
        label="Almacenamiento"
        options={[{ code: 2000, name: '32 GB' }]}
        value={2000}
        onChange={() => {}}
      />,
    )

    const option = screen.getByRole('button', { name: '32 GB' })
    expect(option).toBeInTheDocument()
    expect(option).toHaveAttribute('data-pressed')
  })

  it('renders 2-7 options, pre-selects one, and lets the user change the selection', async () => {
    const user = userEvent.setup()
    const onChange = vi.fn()
    const { rerender } = render(
      <OptionSelector label="Color" options={twoOptions} value={1000} onChange={onChange} />,
    )

    expect(screen.getByRole('button', { name: 'Black' })).toHaveAttribute('data-pressed')
    expect(screen.getByRole('button', { name: 'White' })).not.toHaveAttribute('data-pressed')

    await user.click(screen.getByRole('button', { name: 'White' }))

    expect(onChange).toHaveBeenCalledWith('1001')

    rerender(<OptionSelector label="Color" options={twoOptions} value={1001} onChange={onChange} />)
    expect(screen.getByRole('button', { name: 'White' })).toHaveAttribute('data-pressed')
  })

  it('renders all 7 options and keeps them all visible (not collapsed) with one pre-selected', () => {
    render(
      <OptionSelector label="Color" options={sevenOptions} value={3003} onChange={() => {}} />,
    )

    sevenOptions.forEach((option) => {
      expect(screen.getByRole('button', { name: option.name })).toBeInTheDocument()
    })
    expect(screen.getByRole('button', { name: 'Opt 3' })).toHaveAttribute('data-pressed')
  })

  it('renders more than 7 options, still all rendered and pre-selected (JD-003)', () => {
    render(
      <OptionSelector label="Color" options={eightOptions} value={4007} onChange={() => {}} />,
    )

    expect(screen.getAllByRole('button')).toHaveLength(8)
    expect(screen.getByRole('button', { name: 'Opt 7' })).toHaveAttribute('data-pressed')
  })

  it('keeps the prior selection when the already-pressed option is clicked again (deselect guard)', async () => {
    const user = userEvent.setup()
    const onChange = vi.fn()
    render(
      <OptionSelector label="Color" options={twoOptions} value={1000} onChange={onChange} />,
    )

    await user.click(screen.getByRole('button', { name: 'Black' }))

    expect(onChange).not.toHaveBeenCalledWith(undefined)
    expect(screen.getByRole('button', { name: 'Black' })).toHaveAttribute('data-pressed')
  })
})
