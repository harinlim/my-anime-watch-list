import { useQuery } from '@tanstack/react-query'

import { useCurrentUser } from '@/context/UserContext'
import { fetchWithError } from '@/lib/api'

import type { PublicUser } from '@/types/users'

type UseUsersSearchParams = {
  search: string
  excludeWatchlistId?: number
  limit?: number
}

const fetchUsers = async ({
  search,
  excludeWatchlistId,
  limit,
  signal,
}: { signal: AbortSignal } & UseUsersSearchParams) => {
  const searchParams = new URLSearchParams({ search })

  if (excludeWatchlistId) {
    searchParams.append('excludeWatchlistId', excludeWatchlistId.toString())
  }

  if (limit) {
    searchParams.append('limit', limit.toString())
  }

  return fetchWithError<false, PublicUser[]>(
    `/api/users?${searchParams.toString()}`,
    { method: 'GET', credentials: 'include', signal },
    { prefix: 'Failed to fetch users' }
  )
}

export function useUsersSearch(params: UseUsersSearchParams) {
  // Temporary fix for dynamically changing query results when a user is logged in
  const userId = useCurrentUser()?.id

  return useQuery<PublicUser[]>({
    queryKey: ['users', userId, { ...params }],
    queryFn: async args => fetchUsers({ ...params, ...args }),
    placeholderData: previous => previous, // Use previous data while pending
  })
}
