'use client'

import {
  Button,
  Text,
  Group,
  Stack,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  ModalRoot,
  ModalTitle,
  ActionIcon,
  Tooltip,
} from '@mantine/core'
import { useDisclosure } from '@mantine/hooks'
import { IconEdit, IconPlus } from '@tabler/icons-react'
import clsx from 'clsx'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useMemo, createContext, useContext, memo } from 'react'

import { WatchlistCheckbox } from './WatchlistCheckbox'

import type { Watchlist } from '@/types/watchlists'
import type { ButtonProps } from '@mantine/core'
import type { ReactNode } from 'react'

const WatchlistModalContext = createContext<ReturnType<typeof useDisclosure> | null>(null)

/** Use the override if it exists. Otherwise, use the context */
export function useWatchlistModal() {
  const context = useContext(WatchlistModalContext)
  if (!context) {
    throw new Error('useWatchlistModal must be used within a WatchlistModalProvider')
  }
  return context
}

export function WatchlistModalProvider({
  initialState,
  onOpen,
  onClose,
  children,
}: {
  initialState?: boolean
  onOpen?: () => void
  onClose?: () => void
  children: ReactNode
}) {
  const value = useDisclosure(initialState, { onOpen, onClose })
  return <WatchlistModalContext.Provider value={value}>{children}</WatchlistModalContext.Provider>
}

export function OpenWatchlistModalButton({ ...rest }: ButtonProps) {
  const [, { open }] = useWatchlistModal()
  return (
    <Button onClick={open} size="sm" radius="lg" color="indigo.7" {...rest}>
      <IconPlus size="18" />
      Add to Watchlist
    </Button>
  )
}

type WatchlistRowProps = {
  watchlist: Watchlist
  animeId: string
  defaultChecked: boolean
  className?: string
}

const WatchlistRow = memo(
  ({ watchlist, animeId, defaultChecked, className }: WatchlistRowProps) => {
    const [isLoading, { toggle }] = useDisclosure()

    return (
      <div key={watchlist.id} className={clsx('flex items-center justify-between', className)}>
        <div className="flex min-w-0 items-center gap-5 text-ellipsis">
          <WatchlistCheckbox
            id={`watchlist-${watchlist.id}:${animeId}`}
            animeId={animeId}
            watchlistId={watchlist.id}
            defaultChecked={defaultChecked}
          />
          <Tooltip label={watchlist.title} multiline>
            <Text
              htmlFor={`watchlist-${watchlist.id}:${animeId}`}
              component="label"
              className="line-clamp-2 text-ellipsis break-words text-base"
            >
              {watchlist.title}
            </Text>
          </Tooltip>
        </div>

        <ActionIcon
          component={Link}
          href={`/watchlists/${watchlist.id}`}
          aria-label="Go to watchlist"
          variant="default"
          className="ml-4"
          disabled={isLoading}
          onClick={toggle}
        >
          <IconEdit className="h-6 w-6" stroke={1.5} />
        </ActionIcon>
      </div>
    )
  }
)

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
  const [isOpen, { close }] = useWatchlistModal()
  const currentPath = usePathname()

  const content = useMemo(
    () =>
      // TODO: bubble up checked watchlists to the top
      editableWatchlists.map(watchlist => (
        <WatchlistRow
          className="mt-2 h-10"
          watchlist={watchlist}
          animeId={animeId}
          defaultChecked={initialAddedWatchlists.has(watchlist.id)}
        />
      )),
    [animeId, editableWatchlists, initialAddedWatchlists]
  )

  return (
    <ModalRoot keepMounted opened={isOpen} onClose={close} size="sm" yOffset="20vh">
      <ModalOverlay />
      <ModalContent>
        <Stack gap={0} className="w-full">
          <ModalHeader className="z-50 border-b-2 border-slate-100 dark:border-zinc-700">
            <ModalTitle className="text-lg font-semibold">Add to watchlist</ModalTitle>
            <ModalCloseButton />
          </ModalHeader>

          <ModalBody component="section" className="flex shrink flex-col p-0">
            <div className="relative max-h-64 overflow-auto px-4 pb-4 sm:max-h-80">{content}</div>
          </ModalBody>

          <section className="flex w-full border-t-[1px] border-t-[--mantine-color-gray-3] bg-[--mantine-color-white] px-1 py-1 align-middle dark:border-t-[--mantine-color-dark-4] dark:bg-[--mantine-color-dark-7]">
            <Link
              href={`/watchlists/create?returnURL=${currentPath}`}
              className="w-full rounded-sm px-4 py-3 hover:bg-[--mantine-color-gray-2] dark:hover:bg-[--mantine-color-dark-4]"
            >
              <Group component="span" className="flex-nowrap gap-1">
                <IconPlus size={20} />
                <Text className="ml-2 line-clamp-1">Create new watchlist</Text>
              </Group>
            </Link>
          </section>
        </Stack>
      </ModalContent>
    </ModalRoot>
  )
}
