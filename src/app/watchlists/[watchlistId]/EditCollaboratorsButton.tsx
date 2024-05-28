'use client'

import { ActionIcon as ActionIconButton } from '@mantine/core'
import { IconUserPlus, IconUsers } from '@tabler/icons-react'

import { useCollaboratorsData } from '@/components/collaborators/CollaboratorsContext'
import { useEditCollaboratorsModal } from '@/components/collaborators/CollaboratorsModal/CollaboratorsModalContext'

export function EditCollaboratorsButton() {
  const [, { open }] = useEditCollaboratorsModal()
  const { currentUserCollaborator } = useCollaboratorsData()

  const hasEditAccess =
    currentUserCollaborator?.role === 'owner' || currentUserCollaborator?.role === 'editor'

  return (
    <ActionIconButton
      type="button"
      variant="default"
      size="xl"
      radius="xl"
      aria-label="edit collaborators"
      onClick={open}
      className="p-1 opacity-80"
    >
      {hasEditAccess ? <IconUserPlus size={32} /> : <IconUsers size={30} />}
    </ActionIconButton>
  )
}
