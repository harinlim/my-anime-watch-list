'use client'

import { useDisclosure } from '@mantine/hooks'

import { DeleteWatchlistModal } from '@/components/watchlists/DeleteWatchlistModal'

import { DeleteWatchlistButton } from './DeleteWatchlistButton'

export function DeleteWatchlist({
  watchlistId,
  watchlistTitle,
}: {
  watchlistId: number
  watchlistTitle: string
}) {
  const [opened, { open, close }] = useDisclosure(false)
  return (
    <>
      <DeleteWatchlistButton open={open} />
      <DeleteWatchlistModal
        opened={opened}
        close={close}
        watchlistId={watchlistId}
        watchlistTitle={watchlistTitle}
      />
    </>
  )
}
