'use client'

import {
  ModalRoot,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalTitle,
  ModalCloseButton,
  ModalBody,
  ScrollAreaAutosize,
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
    <ModalRoot
      scrollAreaComponent={ScrollAreaAutosize}
      classNames={{}}
      opened={opened}
      onClose={handleCloseRoot}
      size="md"
      yOffset="25vh"
    >
      <ModalOverlay />

      <FocusTrapInitialFocus />

      <ModalContent>
        <ModalHeader>
          <ModalTitle>{isAddCollaboratorContentOpen && 'Add '}Collaborators</ModalTitle>
          <ModalCloseButton aria-label="Close modal" />
        </ModalHeader>

        <ModalBody className="p-0">
          {isAddCollaboratorContentOpen ? (
            <AddCollaboratorsModalContent
              closeAddCollaboratorContent={toggleAddCollaboratorContent}
            />
          ) : (
            <CollaboratorsModalContent
              watchlistId={watchlistId}
              isPublicWatchlist={isPublicWatchlist}
              openAddCollaboratorContent={toggleAddCollaboratorContent}
            />
          )}
        </ModalBody>
      </ModalContent>
    </ModalRoot>
  )
}
