import { useInfiniteQuery } from '@tanstack/react-query'

import { SEARCH_WATCHLISTS_SORT_TYPES } from '@/api/watchlists/types'
import { useCurrentUser } from '@/context/UserContext'

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
    { method: 'GET', credentials: 'include', signal }
  )

  if (!response.ok) {
    console.error('Failed to fetch watchlists', await response.json())
    throw new Error('Failed to fetch watchlists')
  }

  return response.json() as Promise<SearchWatchlistsResponse>
}

export function useWatchlistsInfiniteSearch(params: UseWatchlistsSearchParams = {}) {
  // Temporary fix for dynamically changing query results when a user is logged in
  const userId = useCurrentUser()?.id

  return useInfiniteQuery({
    queryKey: [`watchlists`, { ...params, userId }],
    queryFn: async args => fetchWatchlists({ ...params, ...args }),
    initialPageParam: 1,
    getNextPageParam: lastPage => lastPage.meta?.next,
  })
}
