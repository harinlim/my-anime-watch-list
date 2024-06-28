'use client'

import { useAutoAnimate } from '@formkit/auto-animate/react'
import { LoadingOverlay } from '@mantine/core'
import clsx from 'clsx'
import { useRouter } from 'next/navigation'
import { useCallback } from 'react'

import { useCurrentUser } from '@/context/UserContext'
import { useDeleteWatchlistCollaborator } from '@/data/use-delete-watchlist-collaborator'
import { useEditWatchlistCollaborator } from '@/data/use-edit-watchlist-collaborator'

import { useCollaboratorsData, useCollaboratorsQuery } from '../CollaboratorsContext'

import { CollaboratorListItem } from './CollaboratorListItem'

import type { PublicUser } from '@/types/users'

type Props = {
  watchlistId: number
  isPublicWatchlist: boolean
  className?: string
}

export function CollaboratorsModalContent({ watchlistId, isPublicWatchlist, className }: Props) {
  const [animateRef] = useAutoAnimate<HTMLUListElement>({ duration: 150 })

  const user = useCurrentUser()
  const router = useRouter()

  const { isLoading, error } = useCollaboratorsQuery()
  const { collaboratorsWithoutUser: collaborators, currentUserCollaborator } =
    useCollaboratorsData()

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
    (option: 'editor' | 'viewer' | 'remove', u: Pick<PublicUser, 'id' | 'username'>) => {
      const collaboratorId = u.id
      if (option === 'remove') {
        deleteCollaborator(
          { collaboratorId: u.id, username: u.username },
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
        updateCollaborator({ role: option, collaboratorId, username: u.username })
      }
    },
    [deleteCollaborator, updateCollaborator, router, isPublicWatchlist, user]
  )

  if (!collaborators || error) return <div>failed to load</div>

  const hasEditAccess =
    currentUserCollaborator?.role === 'owner' || currentUserCollaborator?.role === 'editor'

  return (
    <div className={clsx('relative px-4 pb-2', className)}>
      <LoadingOverlay visible={isLoading} />

      <ul ref={animateRef}>
        {currentUserCollaborator && (
          <CollaboratorListItem
            collaborator={currentUserCollaborator}
            canEdit={currentUserCollaborator?.role === 'editor'}
            canDelete={currentUserCollaborator.role !== 'owner'}
            isSelf
            isPending={isDeletePending && currentUserCollaborator.user_id === deletedUserId}
            onChange={handleEditCollaborator}
            className={
              // Use border as a divider due to HTML semantics with list elements
              currentUserCollaborator && collaborators.length > 0
                ? 'mb-1 h-16 border-b-[1px] border-b-[--mantine-color-gray-1] pb-2 pt-2 dark:border-b-[--mantine-color-dark-5]'
                : undefined
            }
          />
        )}

        {collaborators.map(collaborator => (
          <CollaboratorListItem
            key={collaborator.user_id}
            collaborator={collaborator}
            canEdit={hasEditAccess && collaborator.role !== 'owner'}
            canDelete={currentUserCollaborator?.role === 'owner'}
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
