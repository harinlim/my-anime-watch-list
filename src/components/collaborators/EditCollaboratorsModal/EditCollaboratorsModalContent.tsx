'use client'

import { Center, Divider, Group, Loader, Text } from '@mantine/core'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import clsx from 'clsx'

import { Avatar } from '@/components/watchlists/AvatarGroup'
import { ROLE } from '@/types/collaborators'

import { EditCollaboratorsComboBox } from './EditCollaboratorsComboBox'
import { sortCollaboratorsByRole } from './utils'

import type { ChangableRoleUser, Role } from '@/types/collaborators'
import type { WatchlistUser } from '@/types/watchlists'

type EditCollaboratorsModalContentProps = {
  watchlistId: number | string
  // collaborators: WatchlistUser[]
  userId: string | null
}

const ROLE_TEXT = {
  owner: 'Owner',
  editor: 'Editor',
  viewer: 'Viewer',
} as const satisfies Record<Role, string>

export function EditCollaboratorsModalContent({
  watchlistId,
  // collaborators,
  userId,
}: EditCollaboratorsModalContentProps) {
  const queryClient = useQueryClient()

  const query = async () =>
    fetch(`/api/watchlists/${watchlistId}/users`, {
      method: 'GET',
      credentials: 'include',
    })
      .then(async response => {
        if (!response.ok) {
          throw new Error('Failed to fetch collaborators')
        }
        return response.json()
      })
      .then(data => data as WatchlistUser[])

  const {
    data: collaborators,
    error,
    isLoading,
  } = useQuery<WatchlistUser[]>({
    queryKey: ['collaborators'],
    queryFn: query,
  })

  const { mutate: mutateUpdate } = useMutation({
    mutationFn: async ({ role, collaboratorId }: { role: string; collaboratorId: string }) =>
      fetch(`/api/watchlists/${watchlistId}/users/${collaboratorId}`, {
        method: 'PATCH',
        body: JSON.stringify({ role }),
      }),
    onSettled: async () => queryClient.invalidateQueries({ queryKey: ['collaborators'] }),
  })

  const {
    isPending,
    variables,
    mutate: mutateDelete,
  } = useMutation({
    mutationFn: async (_collaboratorId: string) =>
      fetch(`/api/watchlists/${watchlistId}/users/${_collaboratorId}`, {
        method: 'DELETE',
      }),
    // make sure to _return_ the Promise from the query invalidation
    // so that the mutation stays in `pending` state until the refetch is finished
    onSettled: async () => queryClient.invalidateQueries({ queryKey: ['collaborators'] }),
  })

  if (error) return <div>failed to load</div>
  if (isLoading)
    return (
      <Center className="min-h-56">
        <Loader />
      </Center>
    )

  if (!collaborators) {
    return <p>No profile data</p>
  }

  const userAsCollaborator =
    collaborators.find(collaborator => collaborator.user_id === userId) ?? null

  // Remove the current user from the list of collaborators and group by role
  const groupedCollaborators = sortCollaboratorsByRole(
    collaborators.filter(collaborator => collaborator.user_id !== userId)
  )

  const handleEditCollaborator = (collaboratorId: string, option: string) => {
    if (option === 'delete') {
      mutateDelete(collaboratorId)
    } else {
      mutateUpdate({ role: option, collaboratorId })
    }
  }

  return (
    <div className="min-h-56 px-4 pb-6">
      <ul className="flex flex-col pl-3">
        {userAsCollaborator && (
          <li key={userAsCollaborator.user_id} className="flex items-center justify-between gap-3">
            <Group className="my-3 flex-nowrap">
              <Avatar user={userAsCollaborator} />
              <Text className="text-sm sm:text-base">@{userAsCollaborator.username} (You)</Text>
            </Group>

            {userAsCollaborator.role === ROLE.Editor ? (
              <EditCollaboratorsComboBox
                handleEditCollaborator={handleEditCollaborator}
                user={userAsCollaborator as ChangableRoleUser}
              />
            ) : (
              <Text className="pr-5 text-sm italic opacity-60">
                {ROLE_TEXT[userAsCollaborator.role]}
              </Text>
            )}
          </li>
        )}

        {groupedCollaborators.length > 0 && <Divider className="py-1" />}

        {groupedCollaborators.map(collaborator => (
          <li
            key={collaborator.user_id}
            className={clsx(
              isPending && collaborator.user_id === variables ? 'opacity-50' : '',
              'flex h-14 items-center justify-between gap-3 pt-1'
            )}
          >
            <Group className="flex-nowrap">
              <Avatar user={collaborator} />
              <Text className="overflow-x-auto text-ellipsis text-nowrap text-sm sm:text-base">
                @{collaborator.username}
              </Text>
            </Group>

            {userAsCollaborator &&
            userAsCollaborator.role !== ROLE.Viewer &&
            collaborator.role !== ROLE.Owner ? (
              <EditCollaboratorsComboBox
                isOwner={userAsCollaborator.role === ROLE.Owner}
                handleEditCollaborator={handleEditCollaborator}
                user={collaborator as ChangableRoleUser}
              />
            ) : (
              <Text className="pl-4 pr-8 text-sm italic opacity-60">
                {ROLE_TEXT[collaborator.role]}
              </Text>
            )}
          </li>
        ))}
      </ul>
    </div>
  )
}
