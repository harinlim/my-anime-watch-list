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
  Text,
  Stack,
} from '@mantine/core'
import { useDebouncedValue } from '@mantine/hooks'
import { IconExclamationCircle } from '@tabler/icons-react'
import { useCallback, useMemo, useState } from 'react'

import { Avatar } from '@/components/watchlists/AvatarGroup'
import { useUsersSearch } from '@/data/use-users-search'

import type { PublicUser } from '@/types/users'
import type { ReactNode } from 'react'

type UserSearchAutocompleteProps = {
  onSelectUser: (selectedUser: PublicUser) => void
  isDisabled?: boolean
  disabledMessage?: ReactNode
  selectedUsers: PublicUser[]
  watchlistId?: number
  limit?: number
  className?: string
}

export function UserSearchAutocomplete({
  onSelectUser,
  isDisabled,
  disabledMessage,
  selectedUsers,
  watchlistId,
  limit,
  className,
}: UserSearchAutocompleteProps) {
  const [search, setSearch] = useState('')
  const [debouncedSearch] = useDebouncedValue(search, 500, { leading: true })

  const { data: searchResults, isFetching } = useUsersSearch({
    search: debouncedSearch,
    excludeWatchlistId: watchlistId,
    limit,
  })

  const handleOptionSubmit = useCallback(
    (val: string) => {
      if (isDisabled) {
        return
      }

      const selectedUser = searchResults?.find(user => user.id === val)

      if (!selectedUser) return

      onSelectUser(selectedUser)
    },
    [onSelectUser, isDisabled, searchResults]
  )

  const combobox = useCombobox({
    onDropdownClose: () => combobox.resetSelectedOption(),
    onDropdownOpen: () => combobox.updateSelectedOptionIndex('active'),
  })

  const searchResultsOptions = useMemo(
    () =>
      // TODO: Add avatars
      searchResults?.map((user: PublicUser) => (
        <ComboboxOption
          value={user.id}
          key={user.id}
          active={selectedUsers.includes(user)}
          disabled={isDisabled}
        >
          <Group className="py-2">
            {selectedUsers.some(selectedUser => selectedUser.id === user.id) && (
              <CheckIcon size={12} />
            )}
            <Avatar user={user} className="size-8" />
            <Text size="sm" component="span">
              {user.username}
            </Text>
          </Group>
        </ComboboxOption>
      )),
    [isDisabled, searchResults, selectedUsers]
  )

  return (
    <Stack className="w-full">
      <Combobox store={combobox} onOptionSubmit={handleOptionSubmit} disabled={isDisabled}>
        <ComboboxDropdownTarget>
          <PillsInput
            size="md"
            onClick={() => combobox.openDropdown()}
            aria-label="Search users"
            multiline={false}
            className={className}
          >
            <PillGroup mah={100} style={{ overflowY: 'auto' }}>
              {selectedUsers.map(user => (
                <Pill key={user.id} withRemoveButton onRemove={() => onSelectUser(user)}>
                  @{user.username}
                </Pill>
              ))}

              <ComboboxEventsTarget>
                <PillsInputField
                  onFocus={() => combobox.openDropdown()}
                  onBlur={() => combobox.closeDropdown()}
                  value={search}
                  className="overflow-hidden"
                  placeholder="Search users..."
                  onChange={event => {
                    if (isDisabled) {
                      return
                    }
                    combobox.updateSelectedOptionIndex()
                    setSearch(event.currentTarget.value)
                  }}
                  onKeyDown={event => {
                    if (
                      event.key === 'Backspace' &&
                      search.length === 0 &&
                      selectedUsers.length > 0
                    ) {
                      event.preventDefault()
                      onSelectUser(selectedUsers.at(-1)!)
                    }
                  }}
                />
              </ComboboxEventsTarget>
            </PillGroup>
          </PillsInput>
        </ComboboxDropdownTarget>

        <ComboboxDropdown>
          <ComboboxOptions mih={30} mah={200} style={{ overflowY: 'auto' }}>
            {searchResultsOptions ?? (
              <Combobox.Empty>
                {search === '' && !isFetching ? '' : 'Nothing found...'}
              </Combobox.Empty>
            )}
          </ComboboxOptions>
        </ComboboxDropdown>
      </Combobox>

      {isDisabled && (
        <Group className="mt-2 items-center gap-1 px-1">
          <IconExclamationCircle size={16} className="text-red-700 dark:text-red-400" />
          {disabledMessage && (
            <Text size="sm" className="text-red-700 dark:text-red-400">
              {disabledMessage}
            </Text>
          )}
        </Group>
      )}
    </Stack>
  )
}
