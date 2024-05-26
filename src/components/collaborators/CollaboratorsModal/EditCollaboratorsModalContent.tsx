'use client'

import { LoadingOverlay } from '@mantine/core'
import { useCallback } from 'react'

import { useCurrentUser } from '@/context/UserContext'
import { useDeleteWatchlistCollaborator } from '@/data/use-delete-watchlist-collaborator'
import { useEditWatchlistCollaborator } from '@/data/use-edit-watchlist-collaborator'

import { useCollaborators } from '../CollaboratorsContext'

import { CollaboratorListItem } from './CollaboratorListItem'

type EditCollaboratorsModalContentProps = {
  watchlistId: number
  isPublicWatchlist: boolean
}

export function EditCollaboratorsModalContent({
  watchlistId,
  isPublicWatchlist,
}: EditCollaboratorsModalContentProps) {
  const user = useCurrentUser()

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
        deleteCollaborator({ collaboratorId, isPublicWatchlist })
      } else {
        updateCollaborator({ role: option, collaboratorId })
      }
    },
    [deleteCollaborator, isPublicWatchlist, updateCollaborator]
  )

  if (error) return <div>failed to load</div>

  const userAsCollaborator =
    collaborators.find(collaborator => collaborator.user_id === user?.id) ?? null

  // Remove the current user from the list of collaborators
  // Note the list should be sorted by role by default
  const groupedCollaborators = collaborators.filter(
    collaborator => collaborator.user_id !== user?.id
  )

  return (
    <div className="relative min-h-56 px-4 pb-6">
      <LoadingOverlay visible={isLoading} />

      <ul className="flex flex-col">
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
            canEdit={userAsCollaborator?.role !== 'viewer' && collaborator.role !== 'owner'}
            canDelete={userAsCollaborator?.role === 'owner'}
            isPending={
              (isDeletePending && collaborator.user_id === deletedUserId) ||
              (isUpdatePending && collaborator.user_id === updatedUserId)
            }
            onChange={handleEditCollaborator}
          />
        ))}
      </ul>
    </div>
  )
}
