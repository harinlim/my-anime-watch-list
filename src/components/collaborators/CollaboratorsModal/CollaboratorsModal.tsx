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
  Stack,
} from '@mantine/core'
import { useDisclosure } from '@mantine/hooks'
import { useCallback } from 'react'

import { useEditCollaboratorsModal } from '@/components/collaborators/CollaboratorsModal/CollaboratorsModalContext'

import { AddCollaboratorsModalContent } from './AddCollaboratorModalContent'
import { CollaboratorsModalContent } from './CollaboratorsModalContent'
import { CollaboratorModalFooter } from './CollaboratorsModalFooter'

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

  const [
    isAddCollaboratorContentOpen,
    { open: openAddCollaboratorContent, close: closeAddCollaboratorContent },
  ] = useDisclosure(false)

  const handleCloseModal = useCallback(() => {
    closeAddCollaboratorContent()
    handleCloseRoot()
  }, [handleCloseRoot, closeAddCollaboratorContent])

  return (
    <ModalRoot opened={opened} onClose={handleCloseModal} size="md" yOffset="25vh">
      <ModalOverlay />

      <FocusTrapInitialFocus />

      <ModalContent className="flex min-h-60 min-w-80">
        <Stack gap={0} className="w-full">
          <ModalHeader className="relative z-0 border-b-[1px] border-b-[--mantine-color-gray-3] dark:border-b-[--mantine-color-dark-4]">
            <ModalTitle>{isAddCollaboratorContentOpen && 'Add '}Collaborators</ModalTitle>
            <ModalCloseButton aria-label="Close modal" />
          </ModalHeader>

          <ModalBody component="section" p={0} className="flex shrink flex-col overflow-hidden">
            {isAddCollaboratorContentOpen ? (
              <AddCollaboratorsModalContent
                watchlistId={watchlistId}
                onReturn={closeAddCollaboratorContent}
              />
            ) : (
              <CollaboratorsModalContent
                watchlistId={watchlistId}
                isPublicWatchlist={isPublicWatchlist}
                className="min-h-40 overflow-auto"
              />
            )}
          </ModalBody>

          {!isAddCollaboratorContentOpen && (
            // For now, we hold this here until add functionality is fleshed out
            <CollaboratorModalFooter
              className="shrink-0 grow-0 basis-[calc(3.75rem_*_var(--mantine-scale))] border-t-[1px] border-t-[--mantine-color-gray-3] dark:border-t-[--mantine-color-dark-4]"
              onClickAddCollaborator={openAddCollaboratorContent}
            />
          )}
        </Stack>
      </ModalContent>
    </ModalRoot>
  )
}
