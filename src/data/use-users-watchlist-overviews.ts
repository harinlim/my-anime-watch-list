import { useQuery } from '@tanstack/react-query'

import { useCurrentUser } from '@/context/UserContext'
import { fetchWithError } from '@/lib/api'

import type {
  GetUserWatchlistOverviewsResponse,
  GetUserWatchlistsQueryParams,
} from '@/api/users/[username]/watchlists/types'

const DEFAULT_PAGE_SIZE = 10

type UseUsersWatchlistOverviewsParams = {
  username: string
  editable?: boolean
  limit?: number
  page?: number
}

const fetchUsersWatchlistOverviews = async ({
  username,
  editable,
  limit,
  page,
  signal,
}: { signal: AbortSignal } & UseUsersWatchlistOverviewsParams) => {
  const searchParams: Omit<GetUserWatchlistsQueryParams, 'overview'> = {
    editable,
    page: page ?? 1,
    limit: limit ?? DEFAULT_PAGE_SIZE,
  }

  return fetchWithError<false, GetUserWatchlistOverviewsResponse>(
    // @ts-expect-error -- we know what we're doing
    `/api/users/${username}/watchlists?overview=true&${new URLSearchParams(searchParams).toString()}`,
    { method: 'GET', credentials: 'include', signal },
    { prefix: 'Failed to fetch users' }
  )
}

export function useUsersWatchlistOverviews(
  initialData: GetUserWatchlistOverviewsResponse | null,
  params: UseUsersWatchlistOverviewsParams
) {
  const userId = useCurrentUser()?.id

  return useQuery({
    queryKey: ['watchlists', userId, params.username, params.page, { ...params }],
    queryFn: async ({ signal }) => fetchUsersWatchlistOverviews({ ...params, signal }),
    initialData: params.page === 1 && initialData ? initialData : undefined,
    retry: false,
    // TODO: look into placeholder data error states. Currently it returns the previous success state even if the current state is an error,
    // causing temporary flashing of invalid previous data.
    // placeholderData: keepPreviousData,
  })
}
