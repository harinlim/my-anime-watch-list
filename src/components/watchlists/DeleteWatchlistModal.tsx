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

import { DeleteWatchlistModalContent } from './DeleteWatchlistModalContent'

type EditCollaboratorsModalProps = {
  opened: boolean
  close: () => void
  watchlistId: number
  watchlistTitle: string
}

export function DeleteWatchlistModal({
  opened,
  close,
  watchlistId,
  watchlistTitle,
}: EditCollaboratorsModalProps) {
  return (
    <ModalRoot opened={opened} onClose={close} size="md" yOffset="25vh">
      <ModalOverlay />

      <FocusTrapInitialFocus />

      <ModalContent>
        <Stack gap={0} className="w-full">
          <ModalHeader className="z-0 border-b-[1px] border-b-[--mantine-color-gray-3] dark:border-b-[--mantine-color-dark-4]">
            <ModalTitle>Confirm delete watchlist</ModalTitle>
            <ModalCloseButton aria-label="Close modal" />
          </ModalHeader>

          <ModalBody p="lg" className="space-y-5">
            <DeleteWatchlistModalContent
              watchlistId={watchlistId}
              watchlistTitle={watchlistTitle}
              close={close}
            />
          </ModalBody>
        </Stack>
      </ModalContent>
    </ModalRoot>
  )
}
