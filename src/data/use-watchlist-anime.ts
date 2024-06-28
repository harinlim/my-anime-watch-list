import { useQuery } from '@tanstack/react-query'

import { useCurrentUser } from '@/context/UserContext'
import { fetchWithError } from '@/lib/api'

import type {
  GetWatchlistAnimeQueryParams,
  GetWatchlistAnimeResponse,
} from '@/api/watchlists/[watchlistId]/anime/types'

const DEFAULT_PAGE_SIZE = 10

type UseWatchlistAnimeParams = {
  watchlistId: number
  limit?: number
  page?: number
}

const fetchWatchlistAnime = async ({
  watchlistId,
  limit,
  page,
  signal,
}: { signal: AbortSignal } & UseWatchlistAnimeParams) => {
  const searchParams: GetWatchlistAnimeQueryParams = {
    page: page ?? 1,
    limit: limit ?? DEFAULT_PAGE_SIZE,
  }

  return fetchWithError<false, GetWatchlistAnimeResponse>(
    // @ts-expect-error -- we know what we're doing
    `/api/watchlists/${watchlistId}/anime?${new URLSearchParams(searchParams).toString()}`,
    { method: 'GET', credentials: 'include', signal },
    { prefix: 'Failed to fetch watchlist anime' }
  )
}

export function useWatchlistAnime(
  initialData: GetWatchlistAnimeResponse | null,
  params: UseWatchlistAnimeParams
) {
  const userId = useCurrentUser()?.id

  return useQuery({
    queryKey: ['watchlists', userId, params.watchlistId, params.page, { ...params }],
    queryFn: async ({ signal }) => fetchWatchlistAnime({ ...params, signal }),
    initialData: params.page === 1 && initialData ? initialData : undefined,
    retry: false,
    // TODO: look into placeholder data error states. Currently it returns the previous success state even if the current state is an error,
    // causing temporary flashing of invalid previous data.
    // placeholderData: keepPreviousData,
  })
}
