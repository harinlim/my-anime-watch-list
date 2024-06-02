import { Flex, Text, Group, LoadingOverlay, Space, Button } from '@mantine/core'
import { IconArrowLeft, IconPlus } from '@tabler/icons-react'
import { useCallback, useState } from 'react'

import { useAddWatchlistCollaborator } from '@/data/use-add-watchlist-collaborator'

import { CollaboratorRoleDropdown } from './CollaboratorRoleDropdown'
import { UserSearchAutocomplete } from './UserSearchAutocomplete'

import type { PublicUser } from '@/types/users'
import type { CollaboratorRole, WatchlistUser } from '@/types/watchlists'

type AddCollaboratorsModalContentProps = {
  watchlistId: number
  closeAddCollaboratorContent: () => void
}

const defaultDropdownValue = {
  user_id: '',
  role: 'editor',
  username: '',
  avatar_url: null,
} satisfies WatchlistUser

export function AddCollaboratorsModalContent({
  watchlistId,
  closeAddCollaboratorContent,
}: AddCollaboratorsModalContentProps) {
  const [selectedUsers, setSelectedUsers] = useState<PublicUser[]>([])
  const [role, setRole] = useState<Exclude<CollaboratorRole, 'owner'>>('editor')

  const { mutate, isPending } = useAddWatchlistCollaborator({ watchlistId })

  const handleSelectedUsersChange = useCallback((selectedUser: PublicUser, action: string) => {
    if (action === 'add') {
      setSelectedUsers(current =>
        current.includes(selectedUser)
          ? current.filter(v => v !== selectedUser)
          : [...current, selectedUser]
      )
    } else {
      setSelectedUsers(current => current.filter(v => v !== selectedUser))
    }
  }, [])

  const handleRoleChange = useCallback((_: string, option: 'editor' | 'viewer' | 'remove') => {
    // `remove` should never be passed here
    if (option === 'remove') return

    setRole(option)
  }, [])

  // TODO: Handle mutation error
  const handleAddCollaborators = useCallback(() => {
    const users = selectedUsers.map(user => ({ userId: user.id, role }))
    mutate({ users }, { onSuccess: () => setSelectedUsers([]) })
  }, [mutate, role, selectedUsers])

  return (
    <>
      <LoadingOverlay visible={isPending} zIndex={1000} overlayProps={{ radius: 'sm', blur: 2 }} />
      <div className="space-y-2 p-4">
        <Flex>
          <UserSearchAutocomplete
            selectedUsers={selectedUsers}
            handleSelectedUsersChange={handleSelectedUsersChange}
            watchlistId={watchlistId}
            limit={10}
            className="w-full"
          />
        </Flex>
        <Flex direction="column" gap="md" className="w-full">
          <Flex className="items-center justify-between pl-1">
            <Text size="md">Set all users as:</Text>
            <CollaboratorRoleDropdown
              onChange={handleRoleChange}
              collaborator={defaultDropdownValue}
              canEdit
            />
          </Flex>
          <Space className="max-h-20 shrink" />
          <Group className="w-full justify-between">
            <Button
              color="gray"
              className="flex h-11 items-center px-3 opacity-70"
              onClick={closeAddCollaboratorContent}
            >
              <IconArrowLeft size={20} />
              <Text className="px-2">Go back</Text>
            </Button>
            <Button
              color="cyan"
              className="flex h-11 items-center px-3"
              onClick={handleAddCollaborators}
            >
              <IconPlus size={16} />
              <Text className="pl-2">Add</Text>
            </Button>
          </Group>
        </Flex>
      </div>
    </>
  )
}
