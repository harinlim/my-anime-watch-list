'use client'

import { ActionIcon } from '@mantine/core'
import { IconInfoCircle } from '@tabler/icons-react'
import clsx from 'clsx'

import { useWatchlistSidebar } from './WatchlistSidebarContext'

export function WatchlistSidebarButton({ className }: { className?: string }) {
  const [, { open }] = useWatchlistSidebar()

  return (
    <ActionIcon
      variant="default"
      size="xl"
      radius="xl"
      aria-label="watchlist details"
      onClick={open}
      className={clsx('p-1 opacity-80', className)}
    >
      <IconInfoCircle size={32} />
    </ActionIcon>
  )
}
