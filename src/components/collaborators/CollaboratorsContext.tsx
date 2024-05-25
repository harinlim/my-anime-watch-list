'use client'

import { createContext, useContext } from 'react'

import { useWatchlistUsers } from '@/data/use-watchlist-collaborators'

import type { WatchlistUser } from '@/types/watchlists'
import type { ReactNode } from 'react'

const CollaboratorsContext = createContext<ReturnType<typeof useWatchlistUsers> | null>(null)

/** Use the override if it exists. Otherwise, use the context */
export function useCollaborators() {
  const context = useContext(CollaboratorsContext)
  if (!context) {
    throw new Error('useCollaborators must be used within a CollaboratorsProvider')
  }
  return context
}

export function CollaboratorsProvider({
  initialData,
  watchlistId,
  children,
}: {
  initialData: WatchlistUser[]
  watchlistId: number
  children: ReactNode
}) {
  const value = useWatchlistUsers({ initialData, watchlistId })

  return <CollaboratorsContext.Provider value={value}>{children}</CollaboratorsContext.Provider>
}
