'use client'

import { IconInfoCircle } from '@tabler/icons-react'
import clsx from 'clsx'

import { useWatchlistSidebar } from './WatchlistSidebarContext'

export function WatchlistSidebarButton({ className }: { className?: string }) {
  const [, { open }] = useWatchlistSidebar()

  return (
    <button
      type="button"
      aria-label="watchlist details"
      onClick={open}
      className={clsx(
        'rounded-full border-2 border-solid border-[#c9c9c9] p-1 hover:border-[#a9a9a9] hover:bg-[#f5f5f5] dark:border-[#3a3a3a] dark:hover:border-[#4a4a4a] dark:hover:bg-[#2b2b2b]',
        className
      )}
    >
      <IconInfoCircle size={32} />
    </button>
  )
}