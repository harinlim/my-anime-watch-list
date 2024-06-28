import { useQuery } from '@tanstack/react-query'

import { useCurrentUser } from '@/context/UserContext'
import { fetchWithError } from '@/lib/api'

import type {
  GetUserAnimeQueryParams,
  GetUserAnimeResponse,
} from '@/api/users/[username]/anime/types'

const DEFAULT_PAGE_SIZE = 10

type UseUsersAnimeParams = {
  username: string
  limit?: number
  page?: number
}

const fetchUsersAnime = async ({
  username,
  limit,
  page,
  signal,
}: { signal: AbortSignal } & UseUsersAnimeParams) => {
  const searchParams: GetUserAnimeQueryParams = {
    sort: 'updated_at',
    direction: 'desc',
    page: page ?? 1,
    limit: limit ?? DEFAULT_PAGE_SIZE,
  }

  return fetchWithError<false, GetUserAnimeResponse>(
    // @ts-expect-error -- we know what we're doing
    `/api/users/${username}/anime?${new URLSearchParams(searchParams).toString()}`,
    { method: 'GET', credentials: 'include', signal },
    { prefix: 'Failed to fetch users anime' }
  )
}

// NOTE: Currently, this API endpoint is only enabled for the user's own profile page.
export function useUsersAnime(
  initialData: GetUserAnimeResponse | null,
  params: UseUsersAnimeParams
) {
  const user = useCurrentUser()

  if (params.username !== user?.username) {
    throw new Error("useUsersAnime is only enabled for the user's own anime")
  }

  return useQuery({
    queryKey: ['anime', user?.id, params.username, params.page, { ...params }],
    queryFn: async ({ signal }) => fetchUsersAnime({ ...params, signal }),
    initialData: params.page === 1 && initialData ? initialData : undefined,
    retry: false,
    // TODO: look into placeholder data error states. Currently it returns the previous success state even if the current state is an error,
    // causing temporary flashing of invalid previous data.
    // placeholderData: keepPreviousData,
  })
}
