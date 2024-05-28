'use client'

import { ActionIcon as ActionIconButton } from '@mantine/core'
import { IconEdit } from '@tabler/icons-react'

import { useCollaboratorsData } from '@/components/collaborators/CollaboratorsContext'

export function EditWatchlistButton() {
  const { currentUserCollaborator } = useCollaboratorsData()

  const hasEditAccess =
    currentUserCollaborator?.role === 'owner' || currentUserCollaborator?.role === 'editor'

  if (!hasEditAccess) return null

  return (
    <ActionIconButton
      type="button"
      variant="default"
      size="xl"
      radius="xl"
      aria-label="edit watchlist"
      className="p-1 opacity-80"
    >
      <IconEdit size={32} />
    </ActionIconButton>
  )
}
