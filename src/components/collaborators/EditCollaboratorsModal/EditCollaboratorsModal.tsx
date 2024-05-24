'use client'

import {
  ModalRoot,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalTitle,
  ModalCloseButton,
  ModalBody,
  UnstyledButton,
  Group,
  Divider,
  Container,
  Button,
  Text,
  Flex,
  ScrollAreaAutosize,
} from '@mantine/core'
import { useDisclosure } from '@mantine/hooks'
import { IconPlus, IconUserPlus } from '@tabler/icons-react'

import { EditCollaboratorsModalContent } from './EditCollaboratorsModalContent'

import type { ReactNode } from 'react'

type EditCollaboratorsModalProps = {
  buttonContent: ReactNode
  watchlistId: number | string
  userId: string | null
}

export function EditCollaboratorsModal({
  buttonContent,
  watchlistId,
  userId,
}: EditCollaboratorsModalProps) {
  const [opened, { open, close }] = useDisclosure(false)
  const [addCollaborator, { toggle: openAddCollaborator }] = useDisclosure(false)

  return (
    <>
      <ModalRoot
        scrollAreaComponent={ScrollAreaAutosize}
        opened={opened}
        onClose={close}
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
            {!addCollaborator && (
              <>
                <EditCollaboratorsModalContent watchlistId={watchlistId} userId={userId} />
                <div className="sticky bottom-0 left-0 right-0 z-20 bg-[var(--mantine-color-white)] dark:bg-[var(--mantine-color-dark-7)]">
                  <Divider />
                  <UnstyledButton
                    onClick={openAddCollaborator}
                    className="m-3 w-fit rounded-md px-4 py-3 hover:bg-[var(--mantine-color-gray-1)]  dark:hover:bg-[var(--mantine-color-dark-6)]"
                  >
                    <Group className="flex-nowrap gap-1">
                      <IconPlus size={20} />
                      <Text className="line-clamp-1">Add collaborator</Text>
                    </Group>
                  </UnstyledButton>
                </div>
              </>
            )}
            {addCollaborator && (
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
            )}
          </ModalBody>
        </ModalContent>
      </ModalRoot>
      <UnstyledButton onClick={open} aria-label="edit collaborators">
        {buttonContent}
      </UnstyledButton>
    </>
  )
}
