import { Group, UnstyledButton, Text } from '@mantine/core'
import { IconPlus } from '@tabler/icons-react'
import clsx from 'clsx'

import { useCollaboratorsData } from '../CollaboratorsContext'

type Props = {
  onClickAddCollaborator: () => void
  className?: string
}

export function CollaboratorModalFooter({ onClickAddCollaborator, className }: Props) {
  const { currentUserCollaborator } = useCollaboratorsData()

  const hasAddPermission =
    currentUserCollaborator?.role === 'owner' || currentUserCollaborator?.role === 'editor'

  // For now, we keep this as a guard clause to prevent the button from rendering
  if (!hasAddPermission) {
    return null
  }

  return (
    <section
      className={clsx(
        'flex bg-[--mantine-color-white] px-1 py-1 align-middle dark:bg-[--mantine-color-dark-7]',
        className
      )}
    >
      <UnstyledButton
        onClick={onClickAddCollaborator}
        className="w-full rounded-sm px-4 py-3 hover:bg-[--mantine-color-gray-2] dark:hover:bg-[--mantine-color-dark-4]"
      >
        <Group component="span" className="flex-nowrap gap-1">
          <IconPlus size={20} />
          <Text className="line-clamp-1">Add collaborator</Text>
        </Group>
      </UnstyledButton>
    </section>
  )
}
