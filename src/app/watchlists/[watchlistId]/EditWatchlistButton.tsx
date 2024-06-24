'use client'

import { ActionIcon as ActionIconButton } from '@mantine/core'
import { IconEdit } from '@tabler/icons-react'
import { useRouter } from 'next/navigation'

import { useCollaboratorsData } from '@/components/collaborators/CollaboratorsContext'

export function EditWatchlistButton({ watchlistId }: { watchlistId: number }) {
  const { currentUserCollaborator } = useCollaboratorsData()
  const router = useRouter()

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
      onClick={() => {
        // TODO: use intercepting route to eventually render a modal here
        void router.push(`/watchlists/${watchlistId}/edit`)
      }}
    >
      <IconEdit size={32} />
    </ActionIconButton>
  )
}
