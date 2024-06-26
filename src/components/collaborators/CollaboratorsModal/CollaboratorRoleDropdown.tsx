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

import type { PublicUser } from '@/types/users'
import type { CollaboratorRole } from '@/types/watchlists'

type Props<
  Options extends 'owner' | 'editor' | 'viewer' | 'remove' | undefined = undefined,
  Dynamic extends boolean = false,
  CanDelete extends boolean | undefined = Dynamic extends true
    ? boolean
    : 'remove' extends Options
      ? true
      : false,
  CanEdit extends boolean | undefined = Dynamic extends true
    ? boolean
    : 'editor' | 'viewer' extends Options
      ? true
      : false,
  Roles extends 'owner' | 'editor' | 'viewer' | 'remove' = Dynamic extends true
    ? Options extends undefined
      ? 'owner' | 'editor' | 'viewer' | 'remove'
      : Options
    : Options extends undefined
      ? CanEdit extends true
        ? CanDelete extends true
          ? 'editor' | 'viewer' | 'remove'
          : 'editor' | 'viewer'
        : CanDelete extends true
          ? 'remove'
          : 'owner'
      : Options,
> = {
  canEdit?: CanEdit
  canDelete?: CanDelete
  isDisabled?: boolean
  initialRole: CollaboratorRole
} & ( // TODO: fix inference on `onChange` option param
  | {
      onChange: (option: Roles, user: Pick<PublicUser, 'id' | 'username'>) => void
      user: Pick<PublicUser, 'id' | 'username'>
    }
  | { onChange: (option: Roles) => void; user?: never }
)

const SELECTABLE_ROLES = ['editor', 'viewer'] as const

export function CollaboratorRoleDropdown<
  // TODO: look into why setting `Options` breaks inference
  Options extends 'owner' | 'editor' | 'viewer' | 'remove' | undefined = undefined,
  Dynamic extends boolean = false,
  CanDelete extends boolean | undefined = Dynamic extends true
    ? boolean
    : 'remove' extends Options
      ? true
      : false,
  CanEdit extends boolean | undefined = Dynamic extends true
    ? boolean
    : 'editor' | 'viewer' extends Options
      ? true
      : false,
  Roles extends 'owner' | 'editor' | 'viewer' | 'remove' = Dynamic extends true
    ? Options extends undefined
      ? 'owner' | 'editor' | 'viewer' | 'remove'
      : Options
    : Options extends undefined
      ? CanEdit extends true
        ? CanDelete extends true
          ? 'editor' | 'viewer' | 'remove'
          : 'editor' | 'viewer'
        : CanDelete extends true
          ? 'remove'
          : 'owner'
      : Options,
>({
  onChange,
  isDisabled = false,
  canDelete = false,
  canEdit = false,
  initialRole,
  user,
}: Props<Options, Dynamic, CanDelete, CanEdit, Roles>) {
  const [role, setRole] = useState<CollaboratorRole>(initialRole)

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

  // Wild that this is necessary for inference
  const isOptionValid = useCallback(
    (option: string): option is Roles => {
      if (canDelete && option === 'remove') {
        return true
      }

      if (canEdit && SELECTABLE_ROLES.includes(option)) {
        return true
      }

      return false
    },
    [canDelete, canEdit]
  )

  const handleChangeRole = useCallback(
    (option: string) => {
      if (!isOptionValid(option)) {
        throw new Error(`Invalid option: ${option}`)
      }

      if (user === undefined) {
        onChange(option)
      } else {
        onChange(option, user)
      }

      if (SELECTABLE_ROLES.includes(option)) {
        setRole(option)
      }

      combobox.closeDropdown()
    },
    [onChange, isOptionValid, user, combobox]
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
          className="h-11 min-w-28 bg-transparent opacity-60 hover:bg-[var(--mantine-color-gray-1)] hover:opacity-100 dark:hover:bg-[var(--mantine-color-dark-6)]"
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
              <ComboboxOption key={`${user?.id}-option-${selectableRole}`} value={selectableRole}>
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
