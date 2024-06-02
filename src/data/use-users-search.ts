import { useQuery } from '@tanstack/react-query'

import { useCurrentUser } from '@/context/UserContext'

import type { PublicUser } from '@/types/users'

type UseUsersSearchParams = {
  search: string
  excludeWatchlistId?: number | null
  limit?: number | null
}

const fetchUsers = async ({
  search,
  excludeWatchlistId,
  limit,
  signal,
}: { signal: AbortSignal } & UseUsersSearchParams) => {
  let url = `/api/users?search=${search}`

  if (excludeWatchlistId) {
    url += `&excludeWatchlistId=${excludeWatchlistId}`
  }

  if (limit) {
    url += `&limit=${limit}`
  }

  const response = await fetch(url, {
    method: 'GET',
    credentials: 'include',
    signal,
  })

  if (!response.ok) {
    console.error('Failed to fetch users', await response.json())
    throw new Error('Failed to fetch users')
  }

  return response.json() as Promise<PublicUser[]>
}

export function useUsersSearch(params: UseUsersSearchParams) {
  // Temporary fix for dynamically changing query results when a user is logged in
  const userId = useCurrentUser()?.id

  return useQuery<PublicUser[]>({
    queryKey: ['users', userId, { ...params }],
    queryFn: async args => fetchUsers({ ...params, ...args }),
  })
}
