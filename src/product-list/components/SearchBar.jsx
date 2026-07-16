import { SearchIcon } from 'lucide-react'
import { Field, FieldLabel } from '@/components/ui/field'
import { InputGroup, InputGroupAddon, InputGroupInput } from '@/components/ui/input-group'

// Controlled search input (Marca + Modelo filter). Filtering itself is a
// client-side useMemo in ProductListPage (design.md decision) — this
// component only reports each keystroke, it never queries or debounces.
function SearchBar({ value, onChange }) {
  return (
    <Field>
      <FieldLabel htmlFor="product-search" className="sr-only">
        Buscar
      </FieldLabel>
      <InputGroup className="border-b-[2px]">
        <InputGroupAddon>
          <SearchIcon data-icon aria-hidden="true" className="size-7" />
        </InputGroupAddon>
        <InputGroupInput
          id="product-search"
          type="search"
          placeholder="Buscar por marca o modelo"
          value={value}
          onChange={(event) => onChange(event.target.value)}
          className="text-[1.75rem] uppercase placeholder:text-[1.75rem] placeholder:uppercase md:text-[1.75rem]"
        />
      </InputGroup>
    </Field>
  )
}

export default SearchBar
