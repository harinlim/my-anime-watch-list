import {
  useCombobox,
  Pill,
  Combobox,
  Group,
  CheckIcon,
  PillsInput,
  ComboboxDropdown,
  ComboboxDropdownTarget,
  ComboboxOptions,
  PillGroup,
  PillsInputField,
  ComboboxOption,
  ComboboxEventsTarget,
} from '@mantine/core'
import { useState } from 'react'

import type { SetStateAction } from 'react'

const data = ['🍎 Apples', '🍌 Bananas', '🥦 Broccoli', '🥕 Carrots', '🍫 Chocolate']

export function UserSearchAutocomplete() {
  const combobox = useCombobox({
    onDropdownClose: () => combobox.resetSelectedOption(),
    onDropdownOpen: () => combobox.updateSelectedOptionIndex('active'),
  })

  const [search, setSearch] = useState('')
  const [value, setValue] = useState<string[]>([])

  const handleValueSelect = (val: string) =>
    setValue(current =>
      current.includes(val) ? current.filter(v => v !== val) : [...current, val]
    )

  const handleValueRemove = (val?: string) => setValue(current => current.filter(v => v !== val))

  const values = value.map(item => (
    <Pill key={item} withRemoveButton onRemove={() => handleValueRemove(item)}>
      {item}
    </Pill>
  ))

  const options = data
    .filter((item: string) => item.toLowerCase().includes(search.trim().toLowerCase()))
    .map((item: string) => (
      <ComboboxOption value={item} key={item} active={value.includes(item)}>
        <Group gap="sm">
          {value.includes(item) ? <CheckIcon size={12} /> : null}
          <span>{item}</span>
        </Group>
      </ComboboxOption>
    ))

  return (
    <Combobox store={combobox} onOptionSubmit={handleValueSelect}>
      <ComboboxDropdownTarget>
        <PillsInput onClick={() => combobox.openDropdown()}>
          <PillGroup>
            {values}

            <ComboboxEventsTarget>
              <PillsInputField
                onFocus={() => combobox.openDropdown()}
                onBlur={() => combobox.closeDropdown()}
                value={search}
                placeholder="Search values"
                onChange={(event: { currentTarget: { value: SetStateAction<string> } }) => {
                  combobox.updateSelectedOptionIndex()
                  setSearch(event.currentTarget.value)
                }}
                onKeyDown={(event: { key: string; preventDefault: () => void }) => {
                  if (event.key === 'Backspace' && search.length === 0 && value.length > 0) {
                    event.preventDefault()
                    handleValueRemove(value.at(-1))
                  }
                }}
              />
            </ComboboxEventsTarget>
          </PillGroup>
        </PillsInput>
      </ComboboxDropdownTarget>

      <ComboboxDropdown>
        <ComboboxOptions>
          {options.length > 0 ? options : <Combobox.Empty>Nothing found...</Combobox.Empty>}
        </ComboboxOptions>
      </ComboboxDropdown>
    </Combobox>
  )
}
