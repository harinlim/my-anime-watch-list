import { useInfiniteQuery } from '@tanstack/react-query'

import { SEARCH_WATCHLISTS_SORT_TYPES } from '@/api/watchlists/types'

import type {
  SearchWatchlistsQueryParams,
  SearchWatchlistsResponse,
  SearchWatchlistsSortType,
} from '@/api/watchlists/types'

type UseWatchlistsSearchParams = {
  search?: string
  sort?: SearchWatchlistsSortType
  limit?: number
}

const DEFAULT_PAGE_SIZE = 10

const fetchWatchlists = async ({
  search,
  sort,
  limit,
  pageParam = 1,
  signal,
}: { pageParam?: number; signal: AbortSignal } & UseWatchlistsSearchParams) => {
  const searchParams: SearchWatchlistsQueryParams = {
    page: pageParam,
    limit: limit ?? DEFAULT_PAGE_SIZE,
  }

  if (search) searchParams.search = search
  if (sort && SEARCH_WATCHLISTS_SORT_TYPES.includes(sort)) searchParams.sort = sort

  const response = await fetch(
    // @ts-expect-error -- we know what we're doing
    `/api/watchlists?${new URLSearchParams(searchParams).toString()}`,
    { signal }
  )
  return response.json() as Promise<SearchWatchlistsResponse>
}

export function useWatchlistsInfiniteSearch(params: UseWatchlistsSearchParams = {}) {
  return useInfiniteQuery({
    queryKey: [`watchlists`, { ...params }],
    queryFn: async args => fetchWatchlists({ ...params, ...args }),
    initialPageParam: 1,
    getNextPageParam: lastPage => lastPage.meta?.next,
  })
}
