'use client'

import {
  Text,
  Combobox,
  ComboboxTarget,
  ComboboxDropdown,
  ComboboxOptions,
  ComboboxOption,
  useCombobox,
  Button,
  Divider,
} from '@mantine/core'
import { IconChevronDown } from '@tabler/icons-react'
import { useCallback, useState } from 'react'

import type { ChangableRole, ChangableRoleUser } from '@/types/collaborators'

type Props = {
  onChange: (collaboratorId: string, option: 'editor' | 'viewer' | 'remove') => void
  canEdit?: boolean
  canDelete?: boolean
  isDisabled?: boolean
  collaborator: ChangableRoleUser
}

const SELECTABLE_ROLES = ['editor', 'viewer'] as const

const isOptionValid = (option: string): option is 'editor' | 'viewer' | 'remove' =>
  option === 'editor' || option === 'viewer' || option === 'remove'

export function CollaboratorRoleDropdown({
  onChange,
  isDisabled = false,
  canDelete = false,
  canEdit = false,
  collaborator,
}: Props) {
  const [role, setRole] = useState<ChangableRole>(collaborator.role)

  const combobox = useCombobox({
    onDropdownClose: () => combobox.resetSelectedOption(),
    onDropdownOpen: eventSource => {
      if (eventSource === 'keyboard') {
        combobox.selectActiveOption()
      } else {
        combobox.updateSelectedOptionIndex('active')
      }
    },
  })

  const handleChangeRole = useCallback(
    (option: string) => {
      if (!isOptionValid(option)) {
        throw new Error(`Invalid option: ${option}`)
      }

      onChange(collaborator.user_id, option)

      if (option !== 'remove') {
        setRole(option)
      }

      combobox.closeDropdown()
    },
    [onChange, collaborator.user_id, combobox]
  )

  return (
    <Combobox
      disabled={isDisabled}
      store={combobox}
      resetSelectionOnOptionHover
      onOptionSubmit={handleChangeRole}
    >
      <ComboboxTarget targetType="button">
        <Button
          radius="sm"
          rightSection={<IconChevronDown size={16} className="stroke-black dark:stroke-white" />}
          onClick={() => combobox.toggleDropdown()}
          className="h-11 bg-transparent opacity-60 hover:bg-[var(--mantine-color-gray-1)] hover:opacity-100 dark:hover:bg-[var(--mantine-color-dark-6)]"
        >
          <Text className="py-4 text-sm capitalize text-[var(--mantine-color-dark-9)] dark:text-[var(--mantine-color-gray-3)]">
            {role}
          </Text>
        </Button>
      </ComboboxTarget>

      <ComboboxDropdown className="dark:border-0">
        <ComboboxOptions className="text-sm capitalize">
          {canEdit &&
            SELECTABLE_ROLES.map(selectableRole => (
              <ComboboxOption
                key={`${collaborator.username}-${selectableRole}`}
                value={selectableRole}
              >
                {selectableRole}
              </ComboboxOption>
            ))}

          {canEdit && canDelete && <Divider />}

          {canDelete && (
            <ComboboxOption
              key="remove"
              value="remove"
              className="pt-2 italic text-red-700 dark:text-red-400"
            >
              Remove
            </ComboboxOption>
          )}
        </ComboboxOptions>
      </ComboboxDropdown>
    </Combobox>
  )
}
