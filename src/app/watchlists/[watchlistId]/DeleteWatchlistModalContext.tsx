'use client'

import { useDisclosure } from '@mantine/hooks'
import { createContext, useContext } from 'react'

import type { ReactNode } from 'react'

const DeleteWatchlistModalContext = createContext<ReturnType<typeof useDisclosure> | null>(null)

/** Use the override if it exists. Otherwise, use the context */
export function useDeleteWatchlistModal() {
  const context = useContext(DeleteWatchlistModalContext)
  if (!context) {
    throw new Error('useDeleteWatchlistModal must be used within a DeleteWatchlistModalProvider')
  }
  return context
}

export function DeleteWatchlistModalProvider({
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
    <DeleteWatchlistModalContext.Provider value={value}>
      {children}
    </DeleteWatchlistModalContext.Provider>
  )
}
