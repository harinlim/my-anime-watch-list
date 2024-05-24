import { Text, Combobox, ComboboxTarget, useCombobox, Button, Divider } from '@mantine/core'
import { IconChevronDown } from '@tabler/icons-react'
import { useCallback, useState } from 'react'

import type { ChangableRole, ChangableRoleUser } from '@/types/collaborators'

type EditCollaboratorsComboBoxProps = {
  handleEditCollaborator: (_collaboratorId: string, option: string) => void
  isOwner?: boolean
  user: ChangableRoleUser
}

const ROLE_TEXT = {
  editor: 'Editor',
  viewer: 'Viewer',
} as const

export function EditCollaboratorsComboBox({
  handleEditCollaborator,
  isOwner = false,
  user,
}: EditCollaboratorsComboBoxProps) {
  const [role, setRole] = useState<ChangableRole>(user.role)

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

  const options = Object.entries(ROLE_TEXT).map(([key, option]) => (
    <Combobox.Option key={key} value={key}>
      {option}
    </Combobox.Option>
  ))

  const removeOption = (
    <Combobox.Option
      key="remove"
      value="remove"
      className="pt-2 italic text-red-700 dark:text-red-400"
    >
      <div className="flex items-center">Remove</div>
    </Combobox.Option>
  )

  const handleChangeRole = useCallback(
    (val: string) => {
      handleEditCollaborator(user.user_id, val)

      const newRole = val as ChangableRole

      setRole(newRole)
      combobox.closeDropdown()
    },
    [handleEditCollaborator, user.user_id, combobox]
  )

  return (
    <Combobox store={combobox} resetSelectionOnOptionHover onOptionSubmit={handleChangeRole}>
      <ComboboxTarget targetType="button">
        <Button
          radius="sm"
          rightSection={<IconChevronDown size={16} className="stroke-black dark:stroke-white" />}
          onClick={() => combobox.toggleDropdown()}
          className="h-11 bg-transparent opacity-60 hover:bg-[var(--mantine-color-gray-1)] hover:opacity-100  dark:hover:bg-[var(--mantine-color-dark-6)]"
        >
          <Text className="py-4 text-sm text-[var(--mantine-color-dark-9)] dark:text-[var(--mantine-color-gray-3)]">
            {ROLE_TEXT[role]}
          </Text>
        </Button>
      </ComboboxTarget>

      <Combobox.Dropdown className="dark:border-0">
        <Combobox.Options className="text-sm">
          {options}

          {isOwner && (
            <>
              <Divider />
              {removeOption}
            </>
          )}
        </Combobox.Options>
      </Combobox.Dropdown>
    </Combobox>
  )
}
