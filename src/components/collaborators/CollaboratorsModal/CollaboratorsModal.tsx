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

  const [isAddCollaboratorContent, { toggle: toggleContent }] = useDisclosure(false)

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
      <ModalContent>
        <ModalHeader>
          <ModalTitle>{isAddCollaboratorContent && 'Add '}Collaborators</ModalTitle>
          <ModalCloseButton />
        </ModalHeader>

        <ModalBody className="p-0">
          {isAddCollaboratorContent ? (
            <AddCollaboratorsModalContent closeAddCollaboratorContent={toggleContent} />
          ) : (
            <CollaboratorsModalContent
              watchlistId={watchlistId}
              isPublicWatchlist={isPublicWatchlist}
              openAddCollaboratorContent={toggleContent}
            />
          )}
        </ModalBody>
      </ModalContent>
    </ModalRoot>
  )
}
