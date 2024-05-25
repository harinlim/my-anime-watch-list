import { useQuery } from '@tanstack/react-query'

import { useUser } from '@/context/UserContext'

import type { WatchlistUser } from '@/types/watchlists'

const fetchWatchlistUsers = async (watchlistId: number, { signal }: { signal: AbortSignal }) => {
  const response = await fetch(`/api/watchlists/${watchlistId}/users`, {
    method: 'GET',
    credentials: 'include',
    signal,
  })

  if (!response.ok) {
    console.error('Failed to fetch watchlist collaborators', await response.json())
    throw new Error('Failed to fetch watchlist collaborators')
  }

  return response.json() as Promise<WatchlistUser[]>
}

export function useWatchlistUsers({
  initialData,
  watchlistId,
}: {
  initialData: WatchlistUser[]
  watchlistId: number
}) {
  const userId = useUser()?.id

  return useQuery<WatchlistUser[]>({
    queryKey: ['collaborators', { watchlistId, userId }],
    queryFn: async args => fetchWatchlistUsers(watchlistId, { ...args }),
    initialData,
  })
}
