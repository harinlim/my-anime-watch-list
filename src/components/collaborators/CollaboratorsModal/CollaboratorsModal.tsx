'use client'

import {
  ModalRoot,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalTitle,
  ModalCloseButton,
  ModalBody,
  Container,
  Button,
  Text,
  Flex,
  ScrollAreaAutosize,
} from '@mantine/core'
import { useDisclosure } from '@mantine/hooks'
import { IconUserPlus } from '@tabler/icons-react'

import { useEditCollaboratorsModal } from '@/components/collaborators/CollaboratorsModal/CollaboratorsModalContext'

import { CollaboratorsModalContent } from './EditCollaboratorsModalContent'

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

  const [addCollaborator, { toggle: openAddCollaborator }] = useDisclosure(false)

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
          <ModalTitle>{addCollaborator && 'Add '}Collaborators</ModalTitle>
          <ModalCloseButton />
        </ModalHeader>
        <ModalBody className="p-0">
          {addCollaborator ? (
            <Container>
              <Flex direction="column" gap="md">
                <Text size="sm" className="mb-4">
                  Add a collaborator to this watchlist by entering their email address.
                </Text>
                <Button
                  size="lg"
                  radius="md"
                  color="cyan"
                  className="w-fit"
                  onClick={openAddCollaborator}
                >
                  <IconUserPlus size={20} />
                  <Text>Add collaborator</Text>
                </Button>
              </Flex>
            </Container>
          ) : (
            <CollaboratorsModalContent
              watchlistId={watchlistId}
              isPublicWatchlist={isPublicWatchlist}
              openAddCollaborator={openAddCollaborator}
            />
          )}
        </ModalBody>
      </ModalContent>
    </ModalRoot>
  )
}
