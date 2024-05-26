'use client'

import { Divider, Group, LoadingOverlay, UnstyledButton, Text } from '@mantine/core'
import { IconPlus } from '@tabler/icons-react'
import { useRouter } from 'next/navigation'
import { useCallback } from 'react'

import { useCurrentUser } from '@/context/UserContext'
import { useDeleteWatchlistCollaborator } from '@/data/use-delete-watchlist-collaborator'
import { useEditWatchlistCollaborator } from '@/data/use-edit-watchlist-collaborator'

import { useCollaborators } from '../CollaboratorsContext'

import { CollaboratorListItem } from './CollaboratorListItem'

type Props = {
  watchlistId: number
  isPublicWatchlist: boolean
  openAddCollaboratorContent: () => void
}

export function CollaboratorsModalContent({
  watchlistId,
  isPublicWatchlist,
  openAddCollaboratorContent,
}: Props) {
  const user = useCurrentUser()

  const router = useRouter()

  const { data: collaborators, isLoading, error } = useCollaborators()

  const {
    mutate: updateCollaborator,
    variables: updateVariables,
    isPending: isUpdatePending,
  } = useEditWatchlistCollaborator({ watchlistId })

  const updatedUserId = updateVariables?.collaboratorId

  const {
    mutate: deleteCollaborator,
    variables: deleteVariables,
    isPending: isDeletePending,
  } = useDeleteWatchlistCollaborator({ watchlistId })

  const deletedUserId = deleteVariables?.collaboratorId

  const handleEditCollaborator = useCallback(
    (collaboratorId: string, option: 'editor' | 'viewer' | 'remove') => {
      if (option === 'remove') {
        deleteCollaborator(
          { collaboratorId },
          {
            onSuccess: () => {
              // Redirect to the watchlists page if the current user is removed from a private watchlist
              if (collaboratorId === user?.id && !isPublicWatchlist) {
                router.replace('/watchlists')
              }
            },
          }
        )
      } else {
        updateCollaborator({ role: option, collaboratorId })
      }
    },
    [deleteCollaborator, updateCollaborator, router, isPublicWatchlist, user]
  )

  if (error) return <div>failed to load</div>

  const userAsCollaborator =
    collaborators.find(collaborator => collaborator.user_id === user?.id) ?? null

  // Remove the current user from the list of collaborators
  // Note the list should be sorted by role by default
  const groupedCollaborators = collaborators.filter(
    collaborator => collaborator.user_id !== user?.id
  )

  const hasEditAccess =
    userAsCollaborator?.role === 'owner' || userAsCollaborator?.role === 'editor'

  return (
    <>
      <section className="relative min-h-56 px-4 pb-6">
        <LoadingOverlay visible={isLoading} />

        <ul>
          {userAsCollaborator && (
            <CollaboratorListItem
              collaborator={userAsCollaborator}
              canEdit={userAsCollaborator?.role === 'editor'}
              canDelete={userAsCollaborator.role !== 'owner'}
              isSelf
              isPending={isDeletePending && userAsCollaborator.user_id === deletedUserId}
              onChange={handleEditCollaborator}
              className={
                // Use border as a divider due to HTML semantics with list elements
                userAsCollaborator && groupedCollaborators.length > 0
                  ? 'mb-2 border-b-[1px] border-b-[--mantine-color-gray-3] pb-1'
                  : undefined
              }
            />
          )}

          {groupedCollaborators.map(collaborator => (
            <CollaboratorListItem
              key={collaborator.user_id}
              collaborator={collaborator}
              canEdit={hasEditAccess && collaborator.role !== 'owner'}
              canDelete={userAsCollaborator?.role === 'owner'}
              isPending={
                (isDeletePending && collaborator.user_id === deletedUserId) ||
                (isUpdatePending && collaborator.user_id === updatedUserId)
              }
              onChange={handleEditCollaborator}
            />
          ))}
        </ul>
      </section>

      {hasEditAccess && (
        <div className="sticky bottom-0 left-0 right-0 z-20 flex flex-col bg-[var(--mantine-color-white)] dark:bg-[var(--mantine-color-dark-7)]">
          <Divider />
          <UnstyledButton
            onClick={openAddCollaboratorContent}
            className="m-3 rounded-sm px-4 py-3 hover:bg-[var(--mantine-color-gray-1)]  dark:hover:bg-[var(--mantine-color-dark-6)]"
          >
            <Group className="flex-nowrap gap-1">
              <IconPlus size={20} />
              <Text className="line-clamp-1">Add collaborator</Text>
            </Group>
          </UnstyledButton>
        </div>
      )}
    </>
  )
}