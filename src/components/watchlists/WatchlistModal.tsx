'use client'

import {
  Button,
  Text,
  UnstyledButton,
  Group,
  Stack,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  ModalRoot,
  ModalTitle,
} from '@mantine/core'
import { useDisclosure } from '@mantine/hooks'
import { IconPlus } from '@tabler/icons-react'
import { usePathname, useRouter } from 'next/navigation'
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
  const router = useRouter()
  const currentPath = usePathname()

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
      <ModalRoot keepMounted opened={isOpen} onClose={close} size="sm" yOffset="20vh">
        <ModalOverlay />
        <ModalContent>
          <Stack gap={0} className="w-full">
            <ModalHeader className="z-50 border-b-2 border-slate-100 dark:border-zinc-700">
              <ModalTitle className="text-lg font-semibold">Add to watchlist</ModalTitle>
              <ModalCloseButton />
            </ModalHeader>
            <ModalBody component="section" className="flex shrink flex-col p-0">
              <div className="relative max-h-64 overflow-auto px-6 pb-4 sm:max-h-80">{content}</div>
            </ModalBody>
            <section className="flex w-full border-t-[1px] border-t-[--mantine-color-gray-3] bg-[--mantine-color-white] px-1 py-1 align-middle dark:border-t-[--mantine-color-dark-4] dark:bg-[--mantine-color-dark-7]">
              <UnstyledButton
                onClick={() => router.push(`/watchlists/create?returnURL=${currentPath}`)}
                className="w-full rounded-sm px-4 py-3 hover:bg-[--mantine-color-gray-2] dark:hover:bg-[--mantine-color-dark-4]"
              >
                <Group component="span" className="flex-nowrap gap-1">
                  <IconPlus size={20} />
                  <Text className="line-clamp-1">Create new watchlist</Text>
                </Group>
              </UnstyledButton>
            </section>
          </Stack>
        </ModalContent>
      </ModalRoot>

      <Button onClick={open} size="sm" radius="lg" color="cyan">
        <IconPlus size="18" />
        Add to Watchlist
      </Button>
    </>
  )
}
