import { useQuery } from '@tanstack/react-query'

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
  return useQuery<PublicUser[]>({
    queryKey: ['users', { ...params }],
    queryFn: async args => fetchUsers({ ...params, ...args }),
  })
}
