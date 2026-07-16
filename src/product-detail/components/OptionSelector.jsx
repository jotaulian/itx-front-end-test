import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group'

// Storage/color selector, always visible and always pre-selected — even
// when it has a single option (spec: "Storage and Color Selectors").
// Values are ToggleGroup's single-select mode (base-ui: `multiple=false`,
// the default). `value`/`onChange` here are plain strings/codes; the
// array wrapping base-ui requires is handled internally.
//
// Deselect guard (base-ui, adapted from design.md's Radix-flavored note):
// base-ui's single-select ToggleGroup fires `onValueChange([])` — an empty
// array, not a falsy value — when the currently-pressed item is clicked
// again (confirmed empirically: it exhibits the same deselect-to-empty
// behavior as Radix's `type="single"`, just via an array instead of a
// string). Radix's `if (v) setSelection(v)` guard does not translate
// directly because `[]` is truthy in JS; the equivalent guard here checks
// array length so the previously selected option stays pressed and
// `onChange` never receives `undefined`.
function OptionSelector({ label, options, value, onChange }) {
  return (
    <div className="flex flex-col gap-2">
      <span className="text-sm text-muted-foreground">{label}</span>
      <ToggleGroup
        aria-label={label}
        value={[String(value)]}
        onValueChange={(groupValue) => {
          if (groupValue.length > 0) onChange(groupValue[0])
        }}
      >
        {options.map((option) => (
          <ToggleGroupItem key={option.code} value={String(option.code)}>
            {option.name}
          </ToggleGroupItem>
        ))}
      </ToggleGroup>
    </div>
  )
}

export default OptionSelector
