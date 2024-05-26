'use client'

import {
  ModalRoot,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalTitle,
  ModalCloseButton,
  ModalBody,
  FocusTrapInitialFocus,
} from '@mantine/core'
import { useDisclosure } from '@mantine/hooks'

import { useEditCollaboratorsModal } from '@/components/collaborators/CollaboratorsModal/CollaboratorsModalContext'

import { AddCollaboratorsModalContent } from './AddCollaboratorModalContent'
import { CollaboratorsModalContent } from './CollaboratorsModalContent'

type EditCollaboratorsModalProps = {
  watchlistId: number
  isPublicWatchlist: boolean
} & (
  | {
      isOpen: boolean
      close: () => void
    }
  | {
      isOpen?: never
      close?: never
    }
)

export function CollaboratorsModal({
  isOpen,
  close,
  watchlistId,
  isPublicWatchlist,
}: EditCollaboratorsModalProps) {
  const overrideExists = isOpen !== undefined || close !== undefined

  const [opened, { close: handleCloseRoot }] = useEditCollaboratorsModal(
    overrideExists ? { isOpen, close } : undefined
  )

  const [isAddCollaboratorContentOpen, { toggle: toggleAddCollaboratorContent }] =
    useDisclosure(false)

  return (
    <ModalRoot opened={opened} onClose={handleCloseRoot} size="md" yOffset="25vh">
      <ModalOverlay />

      <FocusTrapInitialFocus />

      <ModalContent className="overflow-hidden">
        <ModalHeader className="border-b-[1px] border-b-[--mantine-color-gray-3] dark:border-b-[--mantine-color-dark-4]">
          <ModalTitle>{isAddCollaboratorContentOpen && 'Add '}Collaborators</ModalTitle>
          <ModalCloseButton aria-label="Close modal" />
        </ModalHeader>

        <ModalBody className="flex h-full max-h-[--modal-size] w-full flex-col p-0">
          {isAddCollaboratorContentOpen ? (
            <AddCollaboratorsModalContent
              closeAddCollaboratorContent={toggleAddCollaboratorContent}
            />
          ) : (
            <CollaboratorsModalContent
              watchlistId={watchlistId}
              isPublicWatchlist={isPublicWatchlist}
              openAddCollaboratorContent={toggleAddCollaboratorContent}
              className="h-full overflow-auto"
            />
          )}

          {/* Optional positioning for a modal footer here. Leaving this for reference */}
          {/* <div className="flex justify-center bg-[var(--mantine-color-gray-1)] p-4 dark:bg-[var(--mantine-color-dark-6)]" /> */}
        </ModalBody>
      </ModalContent>
    </ModalRoot>
  )
}
