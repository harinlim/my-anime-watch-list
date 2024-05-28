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
  LoadingOverlay,
} from '@mantine/core'
import { useDebouncedCallback } from '@mantine/hooks'
import { IconExclamationCircle } from '@tabler/icons-react'
import { useState } from 'react'

import { useUsersSearch } from '@/data/use-users-search'

import type { PublicUser } from '@/types/users'
import type { SetStateAction } from 'react'

type UserSearchAutocompleteProps = {
  handleSelectedUsersChange: (selectedUser: PublicUser, action: string) => void
  selectedUsers: PublicUser[]
  watchlistId?: number
  limit?: number
  className?: string
}

export function UserSearchAutocomplete({
  handleSelectedUsersChange,
  selectedUsers,
  watchlistId,
  limit,
  className,
}: UserSearchAutocompleteProps) {
  const combobox = useCombobox({
    onDropdownClose: () => combobox.resetSelectedOption(),
    onDropdownOpen: () => combobox.updateSelectedOptionIndex('active'),
  })

  const [search, setSearch] = useState('')
  const [searchResults, setSearchResults] = useState<PublicUser[]>([])
  const [isMaxSelected, setIsMaxSelected] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const usersSearchQuery = useUsersSearch({
    search,
    excludeWatchlistId: watchlistId ?? null,
    limit: limit ?? null,
  })

  const handleSearch = useDebouncedCallback(async () => {
    const result = await usersSearchQuery.refetch()

    // if (!result.data) {
    //   throw new Error('Failed to fetch users')
    // }

    setSearchResults(result.data ?? [])
    setIsLoading(false)
  }, 500)

  const handleUserSelect = (val: string) => {
    if (selectedUsers.length >= 10) {
      setIsMaxSelected(true)
      return
    }
    const selectedUser = searchResults.find(user => user.id === val)

    if (!selectedUser) return

    handleSelectedUsersChange(selectedUser, 'add')
    setSearch('')
  }

  const handleUserRemove = (val?: PublicUser) => {
    if (isMaxSelected) {
      setIsMaxSelected(false)
    }

    if (val) {
      handleSelectedUsersChange(val, 'remove')
    }
  }

  const selectedUsersPills = selectedUsers.map(user => (
    <Pill key={user.id} withRemoveButton onRemove={() => handleUserRemove(user)}>
      @{user.username}
    </Pill>
  ))

  const searchResultsOptions = searchResults.map((user: PublicUser) => (
    <ComboboxOption
      value={user.id}
      key={user.id}
      active={selectedUsers.includes(user)}
      disabled={isMaxSelected}
    >
      <Group gap="sm">
        {selectedUsers.some(selectedUser => selectedUser.id === user.id) ? (
          <CheckIcon size={12} />
        ) : null}
        <span>{user.username}</span>
      </Group>
    </ComboboxOption>
  ))

  return (
    <div className="flex w-full flex-col">
      <Combobox store={combobox} onOptionSubmit={handleUserSelect} disabled={isMaxSelected}>
        <ComboboxDropdownTarget>
          <PillsInput
            size="md"
            onClick={() => {
              combobox.openDropdown()
              handleSearch()
            }}
            aria-label="Search users"
            multiline={false}
            className={className}
          >
            <PillGroup mah={100} style={{ overflowY: 'auto' }}>
              {selectedUsersPills}

              <ComboboxEventsTarget>
                <PillsInputField
                  onFocus={() => combobox.openDropdown()}
                  onBlur={() => combobox.closeDropdown()}
                  value={search}
                  className="overflow-hidden"
                  placeholder="Search users..."
                  onChange={(event: { currentTarget: { value: SetStateAction<string> } }) => {
                    if (isMaxSelected) {
                      return
                    }
                    combobox.updateSelectedOptionIndex()
                    setSearch(event.currentTarget.value)
                    handleSearch()
                    setIsLoading(true)
                  }}
                  onKeyDown={(event: { key: string; preventDefault: () => void }) => {
                    if (
                      event.key === 'Backspace' &&
                      search.length === 0 &&
                      selectedUsers.length > 0
                    ) {
                      event.preventDefault()
                      handleUserRemove(selectedUsers.at(-1))
                    }
                  }}
                />
              </ComboboxEventsTarget>
            </PillGroup>
          </PillsInput>
        </ComboboxDropdownTarget>

        <ComboboxDropdown>
          <LoadingOverlay
            visible={isLoading}
            zIndex={1000}
            loaderProps={{ size: 'xs' }}
            overlayProps={{ radius: 'sm', blur: 2 }}
          />
          <ComboboxOptions mih={30} mah={200} style={{ overflowY: 'auto' }}>
            {searchResults.length > 0 ? (
              searchResultsOptions
            ) : (
              <Combobox.Empty>{search === '' ? '' : 'Nothing found...'}</Combobox.Empty>
            )}
          </ComboboxOptions>
        </ComboboxDropdown>
      </Combobox>
      {isMaxSelected && (
        <Group className="mt-2 items-center gap-1 px-1">
          <IconExclamationCircle size={16} className="text-red-700 dark:text-red-400" />
          <Text size="sm" className="text-red-700 dark:text-red-400 ">
            You can only select up to 10 users
          </Text>
        </Group>
      )}
    </div>
  )
}
