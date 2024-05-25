'use client'

import { useDisclosure } from '@mantine/hooks'
import { createContext, useContext } from 'react'

import type { ReactNode } from 'react'

const WatchlistSidebarContext = createContext<ReturnType<typeof useDisclosure> | null>(null)

/** Use the override if it exists. Otherwise, use the context */
export function useWatchlistSidebar() {
  const context = useContext(WatchlistSidebarContext)
  if (!context) {
    throw new Error('useWatchlistSidebar must be used within a WatchlistSidebarProvider')
  }
  return context
}

export function WatchlistSidebarProvider({
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
  return (
    <WatchlistSidebarContext.Provider value={value}>{children}</WatchlistSidebarContext.Provider>
  )
}
