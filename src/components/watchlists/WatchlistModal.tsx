'use client'

import { Modal, Button, Text } from '@mantine/core'
import { useDisclosure } from '@mantine/hooks'
import { IconPlus } from '@tabler/icons-react'
import { useMemo } from 'react'

import { WatchlistCheckbox } from './WatchlistCheckbox'

import type { Watchlist } from '@/types/watchlists'

type WatchlistModalProps = {
  animeId: string
  editableWatchlists: Watchlist[]
  initialAddedWatchlists: Set<number>
}

export function WatchlistModal({
  animeId,
  editableWatchlists,
  initialAddedWatchlists,
}: WatchlistModalProps) {
  const [isOpen, { open, close }] = useDisclosure(false)

  const content = useMemo(
    () =>
      // TODO: bubble up checked watchlists to the top
      // TODO: add link to watchlist
      editableWatchlists.map(watchlist => (
        <div key={watchlist.id} className="mt-4 flex items-center gap-5">
          <WatchlistCheckbox
            id={`watchlist-${watchlist.id}:${animeId}`}
            animeId={animeId}
            watchlistId={watchlist.id}
            defaultChecked={initialAddedWatchlists.has(watchlist.id)}
          />
          <Text
            htmlFor={`watchlist-${watchlist.id}:${animeId}`}
            component="label"
            size="lg"
            className="line-clamp-2"
          >
            {watchlist.title}
          </Text>
        </div>
      )),
    [animeId, editableWatchlists, initialAddedWatchlists]
  )

  return (
    <>
      <Modal.Root keepMounted opened={isOpen} onClose={close} size="sm" yOffset="20vh">
        <Modal.Overlay />
        <Modal.Content>
          <Modal.Header className="border-b-2 border-slate-100 dark:border-zinc-700">
            <Modal.Title className="text-lg font-semibold">Add to watchlist</Modal.Title>
            <Modal.CloseButton />
          </Modal.Header>
          <Modal.Body>{content}</Modal.Body>
        </Modal.Content>
      </Modal.Root>

      <Button onClick={open} size="sm" radius="lg" color="cyan">
        <IconPlus size="18" />
        Add to Watchlist
      </Button>
    </>
  )
}
