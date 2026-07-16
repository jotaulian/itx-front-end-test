import { useState } from 'react'
import { describe, expect, it, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import SearchBar from './SearchBar.jsx'

// Wraps SearchBar the same way ProductListPage will use it: a controlled
// input whose value comes back from the parent's own state.
function ControlledSearchBar({ onKeystroke }) {
  const [value, setValue] = useState('')
  return (
    <SearchBar
      value={value}
      onChange={(next) => {
        setValue(next)
        onKeystroke(next)
      }}
    />
  )
}

describe('SearchBar', () => {
  it('reports each keystroke and stays in sync with the parent-controlled value', async () => {
    const onKeystroke = vi.fn()
    const user = userEvent.setup()
    render(<ControlledSearchBar onKeystroke={onKeystroke} />)

    const input = screen.getByRole('searchbox')
    await user.type(input, 'ace')

    expect(onKeystroke).toHaveBeenCalledTimes(3)
    expect(onKeystroke).toHaveBeenLastCalledWith('ace')
    expect(input).toHaveValue('ace')
  })

  it('renders a value passed in by the parent', () => {
    render(<SearchBar value="iphone" onChange={() => {}} />)

    expect(screen.getByRole('searchbox')).toHaveValue('iphone')
  })
})
