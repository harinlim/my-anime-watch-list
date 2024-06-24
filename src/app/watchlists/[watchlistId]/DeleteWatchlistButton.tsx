'use client'

import { ActionIcon as ActionIconButton } from '@mantine/core'
import { IconTrash } from '@tabler/icons-react'

import { useCollaboratorsData } from '@/components/collaborators/CollaboratorsContext'

import { useDeleteWatchlistModal } from './DeleteWatchlistModalContext'

export function DeleteWatchlistButton() {
  const [, { open }] = useDeleteWatchlistModal()
  const { currentUserCollaborator } = useCollaboratorsData()

  const hasDeleteAccess = currentUserCollaborator?.role === 'owner'

  if (!hasDeleteAccess) return null

  return (
    <ActionIconButton
      type="button"
      variant="default"
      size="xl"
      radius="xl"
      aria-label="edit watchlist"
      className="p-1 opacity-80"
      onClick={open}
    >
      <IconTrash size={32} className="stroke-red-600 dark:stroke-red-400" />
    </ActionIconButton>
  )
}
