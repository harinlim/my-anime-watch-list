import { useInfiniteQuery } from '@tanstack/react-query'

import { SEARCH_WATCHLISTS_SORT_TYPES } from '@/api/watchlists/types'

import type {
  SearchWatchlistsQueryParams,
  SearchWatchlistsResponse,
  SearchWatchlistsSortType,
} from '@/api/watchlists/types'

const DEFAULT_PAGE_SIZE = 10

const SORT_DIRECTIONS = ['asc', 'desc'] as const

type UseWatchlistsSearchParams = {
  search?: string
  // eslint-disable-next-line @typescript-eslint/no-redundant-type-constituents
  sort?: SearchWatchlistsSortType | string | null
  /** This cannot be named `direction` due to namespace with useQuery */
  // eslint-disable-next-line @typescript-eslint/no-redundant-type-constituents
  sortDirection?: (typeof SORT_DIRECTIONS)[number] | string | null
  limit?: number
}

const fetchWatchlists = async ({
  search,
  sort,
  limit,
  sortDirection,
  pageParam = 1,
  signal,
}: { pageParam?: number; signal: AbortSignal } & UseWatchlistsSearchParams) => {
  const searchParams: SearchWatchlistsQueryParams = {
    page: pageParam,
    limit: limit ?? DEFAULT_PAGE_SIZE,
  }

  if (search) searchParams.search = search

  const parsedSort = SEARCH_WATCHLISTS_SORT_TYPES.find(type => type === sort)
  if (parsedSort) {
    searchParams.sort = parsedSort
    searchParams.direction = 'asc'
  } else {
    searchParams.sort = 'updated_at'
    searchParams.direction = 'desc'
  }

  const parsedDirection = SORT_DIRECTIONS.find(dir => dir === sortDirection?.toLowerCase().trim())
  if (parsedDirection) searchParams.direction = parsedDirection

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
