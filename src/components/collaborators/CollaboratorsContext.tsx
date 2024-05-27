'use client'

import { createContext, useContext, useMemo } from 'react'

import { useCurrentUser } from '@/context/UserContext'
import { useWatchlistUsers } from '@/data/use-watchlist-collaborators'

import type { WatchlistUser } from '@/types/watchlists'
import type { ReactNode } from 'react'

type CollaboratorsData = {
  collaboratorsWithoutUser: WatchlistUser[] | null
  currentUserCollaborator: WatchlistUser | null
}

const CollaboratorsQueryContext = createContext<ReturnType<typeof useWatchlistUsers> | null>(null)
const CollaboratorsDataContext = createContext<CollaboratorsData | null>(null)

/** Use the override if it exists. Otherwise, use the context */
export function useCollaboratorsQuery() {
  const context = useContext(CollaboratorsQueryContext)
  if (!context) {
    throw new Error('useCollaborators must be used within a CollaboratorsProvider')
  }
  return context
}

export function useCollaboratorsData() {
  const context = useContext(CollaboratorsDataContext)
  if (!context) {
    throw new Error('useCurrentUserCollaborator must be used within a CollaboratorsProvider')
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
  const queryResult = useWatchlistUsers({ initialData, watchlistId })

  const user = useCurrentUser()
  const currentUserCollaborator = useMemo(
    () => queryResult.data?.find(collaborator => collaborator.user_id === user?.id) ?? null,
    [queryResult.data, user?.id]
  )

  // Remove the current user from the list of collaborators
  // Note the list should be sorted by role by default
  const collaboratorsWithoutUser = useMemo(
    () => queryResult.data?.filter(collaborator => collaborator.user_id !== user?.id) ?? null,
    [queryResult.data, user?.id]
  )

  const collaboratorsData = useMemo(
    () => ({
      collaboratorsWithoutUser,
      currentUserCollaborator,
    }),
    [collaboratorsWithoutUser, currentUserCollaborator]
  )

  return (
    <CollaboratorsQueryContext.Provider value={queryResult}>
      <CollaboratorsDataContext.Provider value={collaboratorsData}>
        {children}
      </CollaboratorsDataContext.Provider>
    </CollaboratorsQueryContext.Provider>
  )
}
