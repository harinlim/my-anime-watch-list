'use client'

import { UnstyledButton } from '@mantine/core'
import { IconUserPlus } from '@tabler/icons-react'

import { EditCollaboratorsModal } from '@/components/collaborators/EditCollaboratorsModal/EditCollaboratorsModal'

type AddCollaboratorIconProps = {
  watchlistId: number | string
  userId: string | null
}

export function AddCollaboratorIcon({ watchlistId, userId }: AddCollaboratorIconProps) {
  const icon = (
    <IconUserPlus
      size={43}
      className="rounded-full border-2 border-solid border-[#c9c9c9] p-1 hover:border-[#a9a9a9] hover:bg-[#f5f5f5] dark:border-[#3a3a3a] dark:hover:border-[#4a4a4a] dark:hover:bg-[#2b2b2b]"
    />
  )

  return (
    <>
      <EditCollaboratorsModal buttonContent={icon} watchlistId={watchlistId} userId={userId} />
      <UnstyledButton />
    </>
  )
}
